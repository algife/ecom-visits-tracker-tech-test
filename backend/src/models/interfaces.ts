import Redis from "ioredis";

export declare interface CountryStats {
    [countryCode: string]: number;
}

export declare interface IRedisService {
    getClient: () => Redis
}