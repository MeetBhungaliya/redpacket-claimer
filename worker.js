const axios = require("axios");
const { QUEUE_NAME } = require("./src/constant");
const { prisma } = require("./src/lib/prisma");
const { Worker } = require("bullmq");
const Redis = require("ioredis");

const redisClient = new Redis({
  username: "default",
  host: "redis-13559.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
  password: "Rxe31KLl35zg43LgReGRNs887wVSsAmN",
  port: 13559,
 
  // username: process.env.REDIS_USERNAME,
  // host: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
  // port: process.env.REDIS_PORT,

  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  connectTimeout: 10000,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    console.error("🔴 Redis Error:", err.message);
    return (
      err.message.includes("ECONNRESET") || err.message.includes("ETIMEDOUT")
    );
  },
  autoResubscribe: true,
  enableAutoPipelining: false,
  lazyConnect: false,
  retryOnTimeout: false,
});

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
        console.log(account.data.url);
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
worker.on("failed", (job, err) => console.log(`❌ Job ${job.id} failed:`, err));

const shutdown = async () => {
  console.log("🔻 Shutting down worker...");
  await worker.close();
  await redisClient.quit();
  await prisma.$disconnect();
  process.exit(0);
};

redisClient.on("connect", () =>
  console.log("✅ Redis connected successfully!")
);
redisClient.on("reconnecting", (time) =>
  console.log(`♻️ Redis reconnecting in ${time / 1000}s...`)
);
redisClient.on("error", (err) => console.error("❌ Redis Error:", err.message));
redisClient.on("end", () => console.log("🔻 Redis connection closed"));

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
