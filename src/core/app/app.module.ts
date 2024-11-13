import { env } from '@config/variables';
import logger from '@utils/logger';
import express from 'express';

/**
 * Application entry point, configures environment variables, middlewares and routers.
 */
export async function startApplication() {
    const app = express();

    app.listen(env.app.port, () =>
        logger.info(
            `Server started at ${env.app.address} in ${env.app.environment.mode} environment.`
        )
    );
}
