import { startApplication } from './core/app';

import generateSwaggerSpec from '@docs/swagger';
import logger from '@utils/logger';
import databaseProvider from './database/database.provider';
import redisProvider from './providers/redis.provider';

// Initializes important connections such as database and redis, before starting the app.
async function initializeConnections() {
    try {
        await databaseProvider.connect();
        await redisProvider.connect();
        startApplication();
    } catch (err) {
        logger.error(err);
        logger.warn('Terminating.');
    }
}

// Generate a swagger spec document before initializing
generateSwaggerSpec()
    .catch((err) => {
        logger.error('Failed to generate swagger docs.');
        logger.error(err);
        process.exit(1);
    })
    .then(initializeConnections);
