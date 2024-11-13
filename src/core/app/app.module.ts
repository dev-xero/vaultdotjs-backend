import { env } from '@config/variables';

import corsOptions from '@config/cors';
import logger from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

/**
 * Application entry point, configures environment variables, middlewares and routers.
 */
export async function startApplication() {
    const app = express();

    app.disable('x-powered-by');

    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false }));

    app.listen(env.app.port, () =>
        logger.info(
            `Server started at ${env.app.address} in ${env.app.environment.mode} environment.`
        )
    );
}
