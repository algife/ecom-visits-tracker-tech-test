import { afterEach, describe, expect, it, jest } from '@jest/globals';
import Redis from 'ioredis-mock';
import request from 'supertest';
import globalConfig from '../src/config/global';
import setupServer from '../src/helpers/setupServer.fn';

const app = setupServer()

// ----- Tests
describe('Ping API', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('GET /api/v1/ping', () => {
        it('should return a simple health check response', async () => {
            const response = await request(app).get('/api/v1/healthcheck');

            expect(response.status).toBe(200);
        });
    });
});