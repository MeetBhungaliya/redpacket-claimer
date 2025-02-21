import Redis from "ioredis";

const redisClient = new Redis({
  username: "default",
  host: "redis-13559.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
  password: "Rxe31KLl35zg43LgReGRNs887wVSsAmN",
  port: 13559,

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
