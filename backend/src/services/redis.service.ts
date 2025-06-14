import Redis from 'ioredis';
import globalConfig from '../config/global.config';
import { IRedisService } from '../models/interfaces';

const _instance: Redis = new Redis(globalConfig.api.redis)
    // Error
    .on('error', (err) => {
        console.error('Redis Client Error:', err);
    })
    // Connect
    .on('connect', () => {
        console.log('Redis Client Connected');
    });
_instance.connect();

const redisService: IRedisService = {
    getClient: () => _instance,
}

export default redisService;
