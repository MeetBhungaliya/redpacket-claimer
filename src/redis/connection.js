import Redis from "ioredis";

const redisClient = new Redis({
  username: process.env.REDIS_USERNAME,
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  port: +process.env.REDIS_PORT,

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

redisClient.on("connect", () =>
  console.log("✅ Redis connected successfully!")
);

redisClient.on("reconnecting", (time) =>
  console.log(`♻️ Redis reconnecting in ${time / 1000}s...`)
);

export default redisClient;
