import { CountryStats } from '../models/interfaces';
import RedisService from '../services/redis.service';

export default async function incrementStat(countryCode: string): Promise<CountryStats> {
    const normalised = countryCode.toLowerCase().trim();
    console.log('Incrementing stat for country code:', normalised);

    if (!normalised || typeof normalised !== 'string' || normalised.length !== 2) {
        throw new Error('Invalid country code format');
    }

    const client = await RedisService.getClient();

    try {
        // Increment operation using pipeline
        const pipeline = client.multi({ pipeline: true });
        pipeline
            // 1. Initialize if not exists
            .hsetnx('country_stats', normalised, 0)
            // 2. Increment the counter for the country code
            .hincrby('country_stats', normalised, 1)

        // Execute the operations
        const execResp = await pipeline.exec();
        if (execResp) {
            const [_opSetNx, opIncr] = execResp;
            const result = opIncr[1] as number;
            if (!result || isNaN(result) || result < 1) return {}

            return { [normalised]: result };
        }
        return {}
    } catch (error) {
        console.error('Error incrementing stat:', error);
        throw error;
    }
}