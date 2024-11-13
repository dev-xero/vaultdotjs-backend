import { env } from '@config/variables';

import swaggerUi from 'swagger-ui-express';
import corsOptions from '@config/cors';
import logger from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import http from '@constants/http';
import generateSwaggerSpec from 'src/docs/swagger';
import swaggerSpec from '@docs/gen/swagger.json';

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

    // generate docs each time in dev
    if (env.app.environment.isInDevelopment) {
        await generateSwaggerSpec().catch((err) => {
            logger.error('Failed to generate swagger docs.');
            logger.error(err);
            process.exit(1);
        });
    }

    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCssUrl:
                'https://cdn.gisthostfor.me/dev-xero-rDghJZYc4z-swagger.css',
        })
    );

    app.get('/', (_: Request, res: Response) => {
        res.status(http.OK).json({
            status: 'success',
            message:
                'API active, all system functional. Prefix request with v1 to access the API.',
            code: http.OK,
        });
    });

    app.listen(port, () =>
        logger.info(
            `Server started at ${env.app.address} in ${env.app.environment.mode} environment.`
        )
    );
}
