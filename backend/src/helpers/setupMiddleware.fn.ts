import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import globalConfig from "../config/global.config";

const setupMiddleware = (app: express.Express) => {
    app
        // -------- Security
        .use(helmet())  // Adds various HTTP headers for security
        .use(cors(globalConfig.api.cors))
        // -------- Performance
        .use(compression())  // Compress responses
        // -------- Static assets
        // .use(express.static('public')) // Static folder
        // -------- Parsing
        .use(express.json({ limit: '10kb' }))  // Limit request body size
        .use(express.urlencoded({ extended: true, limit: '10kb' }));

    return app;
}
export default setupMiddleware;