/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL:
      "mongodb+srv://meet:e85e4428fef256f82320fb11cc3769bebd69d317f4a77bdb46b05e4de34be9fa13a668f9973a0efdb4eb7aed5b35b2c5@clust.29ck8.mongodb.net/red-pack",
    TELEGRAM_BOT_TOKEN: "7825300677:AAE2hpAE_DsEboFpXEkDnAi3_OFOOyMrfuI",
    REDIS_URL: "redis-13559.c264.ap-south-1-1.ec2.redns.redis-cloud.com:13559",
  },
};

export default nextConfig;
