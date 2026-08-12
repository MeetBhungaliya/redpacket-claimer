/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL:
      "mongodb+srv://meet:Meet1234@freecluster.gmwtasd.mongodb.net/red-pack",
    REDIS_USERNAME: "default",
    REDIS_URL: "redis-14998.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    REDIS_PASSWORD: "O6CpqsSfoJRBu3qwWVHwkaAKBsVzFI5o",
    REDIS_PORT: "14998",
  },
};

export default nextConfig;
