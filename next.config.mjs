/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL:
      "mongodb+srv://meet:Meet1234@freecluster.gmwtasd.mongodb.net/red-pack",
    REDIS_USERNAME: "default",
    REDIS_URL: "redis-13235.c90.us-east-1-3.ec2.cloud.redislabs.com",
    REDIS_PASSWORD: "IDO2wPE6iBFuSrbi5bVzkTyAESfjGYoh",
    REDIS_PORT: 13235,
  },
};

export default nextConfig;
