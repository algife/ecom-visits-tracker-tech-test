import dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';

// Initialize environment variables
dotenv.config();

const globalConfig = {
    isDev: process.env.NODE_ENV === "development",
    PORT: parseInt(process.env.PORT || "3030", 10),
    api: {
        BASE_URL: '/api/v1',
        cache: { time: '500 milliseconds' }, // TODO: Needs improvements
        redis: {
            host: process.env.REDIS_HOST || 'redis',
            port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
            maxRetriesPerRequest: 3,
            enableReadyCheck: false, // Disable ready check for faster startup
            lazyConnect: true, // connect only when needed
            // High throughput optimizations
            enableOfflineQueue: true,
            commandTimeout: 5000,
            retryStrategy: (times: number) => {
                if (times > 3) return null;
                return Math.min(times * 200, 1000);
            },
            // Connection pool
            connectionName: 'country_stats-tracker',
            db: 0,
            // Performance optimizations
            keyPrefix: 'country_stats',
            maxLoadingRetryTime: 2000,
            connectTimeout: 10000,
            disconnectTimeout: 2000,
            // High availability settings
            autoResubscribe: true,
            autoResendUnfulfilledCommands: true,
            // Memory management
            maxScriptsCaching: 100,
        } as RedisOptions,
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
        },
        rateLimit: {
            windowMs: 60 * 1000, // 1 minute
            max: 100, // 100 requests per minute per IP
            standardHeaders: true,
            message: {
                error: 'Too many requests. Please try again later.'
            }
        }
    },
};

export default globalConfig;