"use server";

import { QUEUE_NAME } from "@/constant";
import { prisma } from "@/lib/prisma";
import { Worker } from "bullmq";
import redisClient from "./connection";
import axios from "axios";

const CACHE_KEY = "cached_accounts";
const CACHE_TTL = 60 * 60 * 24;

const fetchAccounts = async () => {
  const cachedAccounts = await redisClient.get(CACHE_KEY);
  if (cachedAccounts) {
    console.log("⚡ Using cached accounts data");
    return JSON.parse(cachedAccounts);
  }

  console.log("📥 Fetching accounts from DB...");
  const accounts = await prisma.account.findMany();

  await redisClient.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(accounts));
  return accounts;
};

const checkCode = async (grabCode) => {
  try {
    const accounts = await fetchAccounts();

    const recentAccount = accounts[0];

    const data = {
      grabCode,
      channel: "DEFAULT",
    };

    const checkCodeURL = recentAccount.data.url.replace(/grabV2$/, "query");

    const res = await axios({
      method: "POST",
      url: checkCodeURL,
      headers: recentAccount.data.headers,
      data,
    });

    return res.data.success;
  } catch (error) {
    console.log(error, "ERRR");
    return false;
  }
};

const initWorker = () => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const isValidCode = await checkCode(job.data);

      if (!isValidCode) {
        console.log(`Invalid code: ${job.data}. Removing from queue.`);
        return Promise.resolve();
      }

      const data = {
        grabCode: job.data,
        channel: "DEFAULT",
        scene: null,
      };

      const accounts = await fetchAccounts();

      const res = await Promise.allSettled(
        accounts.map(async (account) => {
          return await axios({
            method: "POST",
            url: account.data.url,
            headers: account.data.headers,
            data,
          });
        })
      );
    },
    {
      connection: redisClient,
      lockDuration: 5000,
      removeOnComplete: { age: 3600, count: 1000 },
      removeOnFail: { age: 86400, count: 1000 },
    }
  );

  worker.on("completed", (job) => console.log(`✅ Job ${job.id} finished`));
  worker.on("failed", (job, err) =>
    console.log(`❌ Job ${job.id} failed:`, err)
  );
};

export { initWorker };
