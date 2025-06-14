import globalConfig from '../config/global.config';
import { CountryStats } from '../models/interfaces';
import redisService from '../services/redis.service';

const INITIAL_DATA: CountryStats = {};

function parseCountryStatsResponse(statsResponse: Record<string, string>): CountryStats {
    const parsedResponse = statsResponse;
    return Object.fromEntries(
        Object.entries(parsedResponse)
            .map(([k, v]) => [k.toLowerCase(), parseInt(v || "0", 10)])
    )
}

export default async function fetchAllStats(): Promise<CountryStats> {
    try {
        const dbKeyPrefix = globalConfig.api.redis.keyPrefix || "";
        const client = await redisService.getClient();
        const pipeline = await client.multi({ pipeline: true });

        // Initialize default data if not exists
        Object.entries(INITIAL_DATA).map(([k, v]) =>
            pipeline.hsetnx(dbKeyPrefix, k, v));

        // Get all stats
        pipeline.hgetall(dbKeyPrefix);

        const response = (await pipeline.exec());
        const result = response?.reverse()[0][1] as Record<string, string> | null;

        // Convert string values to numbers and ensure valid data
        let stats = result != null ? parseCountryStatsResponse(result) : {};

        return stats;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
}