import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Redis from 'ioredis-mock';

import assert from 'assert';
import request from 'supertest';
import globalConfig from '../src/config/global';
import delay from '../src/helpers/delay.fn';
import setupServer from '../src/helpers/setupServer.fn';
import cacheService from '../src/services/cache.service';

// Mock the redis service
// jest.mock('../src/services/redis.service', async () => {
//     const instance = new Redis({ ...globalConfig.api.redis, db: 1, keyPrefix: "testing_tracker" });
//     instance.connect();

//     return { getClient: () => instance };
// });

const app = setupServer()

jest.mock("../src/services/redis.service", () => {
    const _instance = new Redis({ ...globalConfig.api.redis, keyPrefix: "testing_db", db: 111 })
    _instance.connect();

    const redisServiceMock = { getClient: () => _instance };
    return redisServiceMock;
})

const getDBClient = async () => (await require("../src/services/redis.service")).getClient();


// ----- Tests
describe('Stats API', () => {
    beforeEach(() => {
        // Clear DB before each test
        getDBClient().then(c => c.flushall());
    });

    describe('GET /api/v1/stats', () => {
        it('should return empty stats when no visits recorded', async () => {
            const response = await request(app).get('/api/v1/stats');

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({});
        });
        it('should be able to POST/record a single new visit', async () => {
            const countryCode = "GB";
            const response = await request(app).post(`/api/v1/stats?countryCode=${countryCode.toUpperCase()}`);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({ [`${countryCode.toLowerCase()}`]: 1 });
        });


        it('should handle concurrent requests correctly', async () => {
            const count = 15; // Must be below the rate limit threshold (100 per IP as of date of writing this comment)
            // Send multiple concurrent requests
            const requests = Array(count).fill(null).map(() =>
                request(app).post('/api/v1/stats?countryCode=PT')
            );

            await Promise.all(requests);

            await cacheService.clear();
            await delay(300);
            const stats = await request(app).get('/api/v1/stats');
            expect(stats.body).toMatchObject({ "pt": count });
        });



        it('should be able to record MULTIPLE visits at once, and fetch the valid tracking records afterwards', async () => {
            // Record some visits
            const countries = ["US", "GB", "US", "ES", "JP", "AU", "AU"];
            const urls = countries.map(cc => `/api/v1/stats?countryCode=${cc.toUpperCase()}`)
            const resp = await Promise.all(urls.map(url => request(app).post(url)));
            expect(resp).toHaveLength(countries.length);
            await Promise.all(resp.map((obj, i) => {
                expect(obj.statusCode).toBe(201)
                expect(obj.body).toHaveProperty(countries[i].toLowerCase())
            }))

            // Fetch latest up-to-date data from DB
            await cacheService.clear();
            await delay(300);
            const response = await request(app).get('/api/v1/stats');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                "us": 2,
                "gb": 1,
                "es": 1,
                "jp": 1,
                "au": 2
            });
        });


        it('should reject POST requests without country code', async () => {
            const response = await request(app).post('/api/v1/stats');
            expect(response.statusCode).toBe(422);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toMatch("Country code is required");
        })
        it('should reject invalid country codes', async () => {
            const response = await request(app).post('/api/v1/stats?countryCode=USA');

            expect(response.statusCode).toBe(403);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain("Invalid country code");
        });

        it('should rate limit too many requests from the same IP', async () => {

            const count = 111; // above rate limit threshold
            // Send multiple concurrent requests
            const requests = Array(count).fill("").map(() =>
                request(app).post('/api/v1/stats?countryCode=PT')
            );

            const responses = (await Promise.all(requests).catch(err => {
                // Failed as expected
                return err;
            })).filter((r: { statusCode: number; }) => r.statusCode === 429);

            await cacheService.clear();
            await delay(300);

            const errorResponseExample = responses[0];

            assert(errorResponseExample);
            expect(errorResponseExample.statusCode).toBe(429);
            expect(errorResponseExample.body.error).toContain("Too many requests");
        });
    });
});

