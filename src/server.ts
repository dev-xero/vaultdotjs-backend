import { startApplication } from './core/app';

import generateSwaggerSpec from '@docs/swagger';
import logger from '@utils/logger';

generateSwaggerSpec()
    .catch((err) => {
        logger.error('Failed to generate swagger docs.');
        logger.error(err);
        process.exit(1);
    })
    .then(() => startApplication());
