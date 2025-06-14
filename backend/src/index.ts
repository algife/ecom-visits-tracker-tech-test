import cluster from 'cluster';
import dotenv from 'dotenv';
import express from 'express';
import os from 'os';
import globalConfig from './config/global.config';
import { setupDocumentation } from './config/swagger.config';
import onServerInit from './helpers/onServerInit.fn';
import setupMiddleware from './helpers/setupMiddleware.fn';
import setupRoutes from './helpers/setupRoutes.fn';

dotenv.config();

const nodeEnv = process.env.NODE_ENV;
const isClusterEnabled = Boolean(process.env.ENABLE_CLUSTER || "");

// Cluster mode for high load
if (isClusterEnabled && cluster.isPrimary && nodeEnv === 'production') {
  console.log(`Primary ${process.pid} is running`);
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, _code, _signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  console.log("CLUSTER is enabled", numCPUs)
} else {

  // ---- INITIALIZATION
  const server = express();

  setupMiddleware(server);
  setupDocumentation(server);
  setupRoutes(server);

  server.listen(globalConfig.PORT, onServerInit)
};
