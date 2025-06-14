import apicache from "apicache";
import dotenv from "dotenv";
import globalConfig from "../config/global.config";

dotenv.config()

const cache = apicache
    .options({ enabled: true, debug: process.env.NODE_DEV === "development" })
    .middleware;

const instance = cache(globalConfig.api.cache.time);

const cacheService = {
    getInstance: () => instance,
    clear: async () => {
        // const target = globalConfig.api.redis.keyPrefix;
        await apicache.clear();
    }
}

export default cacheService;