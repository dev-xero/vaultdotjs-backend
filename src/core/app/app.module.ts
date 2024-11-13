import { env } from '@config/variables';

import swaggerUi from 'swagger-ui-express';
import corsOptions from '@config/cors';
import logger from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import http from '@constants/http';
import swaggerSpec from '@docs/gen/swagger.json';
import cached from '@middleware/cache';
import notFoundHandler from '@middleware/notfound';

/**
 * Application entry point, configures environment variables, middlewares and routers.
 */
export async function startApplication() {
    const app = express();
    const port = env.app.port;

    app.disable('x-powered-by');

    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false }));

    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customSiteTitle: 'Vault.js API Documentation',
            customCssUrl:
                'https://cdn.gisthostfor.me/dev-xero-rDghJZYc4z-swagger.css',
        })
    );

    app.get('/', cached('5 minutes'), (_: Request, res: Response) => {
        /**
         * #swagger.tags = ["Base"]
         * #swagger.summary = "Used for health checks, returns 200."
         * #swagger.description = "Health check endpoint, returns 200 if the server started successfully."
         */
        res.status(http.OK).json({
            status: 'success',
            message:
                'API active, all system functional. Prefix request with v1 to access the API.',
            code: http.OK,
        });
    });

    app.use(notFoundHandler);

    app.listen(port, () =>
        logger.info(
            `Server started at ${env.app.address} in ${env.app.environment.mode} environment.`
        )
    );
}
