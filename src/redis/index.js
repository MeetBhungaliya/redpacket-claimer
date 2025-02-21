"use server";

import { QUEUE_NAME } from "@/constant";
import { prisma } from "@/lib/prisma";
import { Worker } from "bullmq";
import redisClient from "./connection";
import axios from "axios";

const CACHE_KEY = "cached_accounts";
const CACHE_TTL = 60 * 60 * 24;

const fetchAccounts = async () => {
  const cachedUsers = await redisClient.get(CACHE_KEY);
  if (cachedUsers) {
    console.log("⚡ Using cached accounts data");
    return JSON.parse(cachedUsers);
  }

  console.log("📥 Fetching accounts from DB...");
  const accounts = await prisma.account.findMany();

  await redisClient.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(accounts));
  return accounts;
};

const initWorker = () => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const data = {
        grabCode: job.data,
        channel: "DEFAULT",
        scene: null,
      };

      const accounts = await fetchAccounts();

      await Promise.all(
        accounts.map((account) => {
          return axios({
            method: "POST",
            url: account.data.url,
            headers: account.data.headers,
            data,
          });
        })
      );
    },
    { connection: redisClient, concurrency: 2 }
  );

  worker.on("completed", (job) => console.log(`✅ Job ${job.id} finished`));
  worker.on("failed", (job, err) =>
    console.log(`❌ Job ${job.id} failed:`, err)
  );
};

export { initWorker };
