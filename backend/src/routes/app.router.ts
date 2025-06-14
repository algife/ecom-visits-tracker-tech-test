
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import globalConfig from '../config/global.config';
import cacheService from '../services/cache.service';

// -----
const rateLimitMiddleware = rateLimit(globalConfig.api.rateLimit);
const cacheMiddleware = cacheService.getInstance();

/**
 * Router for handling stats-related requests.
 */
const appRouter = Router();

appRouter
    .get('/healthcheck', (_req, res, _next) => { res.sendStatus(200); })

export default appRouter;
