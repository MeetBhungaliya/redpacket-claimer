import { getEnvSafely } from "./config";

/**
 * For server-used only
 */
const MONGODB_URI = getEnvSafely("MONGODB_URI");
const TELEGRAM_BOT_TOKEN = getEnvSafely("TELEGRAM_BOT_TOKEN");

const env = {
  MONGODB_URI,
  TELEGRAM_BOT_TOKEN,
};

export default env;
