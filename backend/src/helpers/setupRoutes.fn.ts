import { Express } from 'express';
import globalConfig from '../config/global.config';
import appRouter from '../routes/app.router';
import statsRouter from '../routes/stats.router';

const setupRoutes = (app: Express) => {
    const baseUrl = globalConfig.api.BASE_URL;

    app
        // ---- API ROUTES
        .use(`${baseUrl}/stats`, statsRouter)
        .use(baseUrl, appRouter)

    return app;
}

export default setupRoutes
