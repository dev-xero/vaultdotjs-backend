import { env } from '@config/variables';
import { startApplication } from './core/app';
import generateSwaggerSpec from '@docs/swagger';
import logger from '@utils/logger';

// generate docs each time in dev
if (env.app.environment.isInDevelopment) {
    generateSwaggerSpec()
        .catch((err) => {
            logger.error('Failed to generate swagger docs.');
            logger.error(err);
            process.exit(1);
        })
        .then(() => startApplication());
} else {
    startApplication();
}
