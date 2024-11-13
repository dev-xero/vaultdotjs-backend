import { environment } from './environment';
import dotenv from "dotenv";

dotenv.config();

/**
 * Typescript mapping of the environment variables.
 */
export const env = Object.freeze({
    app: {
        port: parseInt(process.env.PORT ?? '8000', 10) || 8000,
        address:
            process.env.ENVIRONMENT == 'dev'
                ? `http://${process.env.HOSTNAME}:${process.env.PORT}`
                : `https://${process.env.HOSTNAME}`,
        environment: {
            mode: process.env.ENVIRONMENT,
            isInProduction: environment.PROD == process.env.ENVIRONMENT,
            isInDevelopment: environment.DEV == process.env.ENVIRONMENT,
        },
    },
});
