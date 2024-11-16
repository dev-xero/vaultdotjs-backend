import { env } from '@config/variables';
import { authRouter } from '@core/auth';

import swaggerUi from 'swagger-ui-express';
import corsOptions from '@config/cors';
import logger from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import http from '@constants/http';
import swaggerSpec from '@docs/gen/swagger.json';
import cached from '@middleware/cache';
import notFoundHandler from '@middleware/notfound';
import globalErrorHandler from '@middleware/errorhandler';
import { connectionRouter } from '@core/connection';

/**
 * Application entry point, configures environment variables, middlewares and routers.
 */
export async function startApplication() {
    const app = express();
    const port = env.app.port;

    app.disable('x-powered-by');

    app.use(helmet());
    app.use(compression());
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false }));

    app.use(express.json());

    // prevent json parsing errors
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof SyntaxError) {
            res.status(http.BAD_REQUEST).json({
                status: 'syntax_error',
                message: 'malformed json received.',
                code: http.BAD_REQUEST,
            });
        }

        next();
    });

    // serves swagger documentation
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customSiteTitle: 'Vault.js API Documentation',
            customCssUrl:
                'https://cdn.gisthostfor.me/dev-xero-rDghJZYc4z-swagger.css',
        })
    );

    // use all defined routers
    app.use('/v1/auth', authRouter);
    app.use('/v1/connection', connectionRouter);

    // base endpoint
    app.get('/', cached('5 minutes'), (_: Request, res: Response) => {
        /*
            #swagger.tags = ["Base"]
            #swagger.summary = "Used for health checks, returns 200."
            #swagger.description = "Health check endpoint, returns 200 if the server started successfully."
        */
        res.status(http.OK).json({
            status: 'success',
            message:
                'API active, all system functional. Prefix request with v1 to access the API.',
            code: http.OK,
        });
    });

    // not found and error handler middleware
    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    app.listen(port, () =>
        logger.info(
            `Server started at ${env.app.address} in ${env.app.environment.mode} environment.`
        )
    );
}
