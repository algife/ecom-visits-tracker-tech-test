import { NextFunction, Request, Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import globalConfig from '../config/global.config';
import errorHandler from '../helpers/errorHandler.fn';
import fetchAllStats from '../helpers/fetchAllStats.fn';
import incrementStat from '../helpers/incrementStat.fn';
import cacheService from '../services/cache.service';

const rateLimitMiddleware = rateLimit(globalConfig.api.rateLimit);
const cacheMiddleware = cacheService.getInstance();


/**
 * Router for handling stats-related requests.
 */
const statsRouter = Router();

statsRouter
    // API sub ROUTES
    .get('/', rateLimitMiddleware, cacheMiddleware, statsGetHandler)
    .post('/', rateLimitMiddleware, statsPostHandler);

// -----
async function statsGetHandler(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const stats = await fetchAllStats();
        res.status(200).json(stats);
    } catch (err) {
        next(errorHandler<object>(500, 'Error fetching all stats:', err, {}, res));
    }
};


async function statsPostHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { countryCode } = req.query as { countryCode: string };

        if (!countryCode) {
            res.status(422).json({
                error: 'Country code is required',
                code: 'MISSING_COUNTRY_CODE'
            });
            return;
        }

        if (!/^[A-Za-z]{2}$/.test(countryCode)) {
            res.status(403).json({
                error: 'Invalid country code format. Must be exactly 2 letters',
                code: 'INVALID_COUNTRY_CODE_FORMAT'
            });
            return;
        }

        await cacheService.clear();
        const item = await incrementStat(countryCode);

        res.status(201).json(item);
    } catch (err) {
        next(errorHandler<object>(500, 'Error tracking visit:', err, {}, res));
    }
};

export default statsRouter;