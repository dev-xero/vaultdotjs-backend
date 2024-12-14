import { environment } from './environment';

import dotenv from 'dotenv';

dotenv.config();

/**
 * Typescript mapping of the environment variables.
 */
export const env = Object.freeze({
    app: {
        port: parseInt(process.env.PORT ?? '8000', 10) || 8000,
        hostname: process.env.HOSTNAME,
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
    redisURI: process.env.REDIS_URI,
    tokens: {
        accessKey: process.env.ACCESS_TOKEN_KEY,
        refreshKey: process.env.REFRESH_TOKEN_KEY,
    },
    b2: {
        applicationKeyId: process.env.BACKBLAZE_APP_KEY_ID || '',
        applicationKey: process.env.BACKBLAZE_APP_KEY || '',
        bucketId: process.env.BACKBLAZE_BUCKET_ID || '',
        bucketName: process.env.BACKBLAZE_BUCKET_NAME || '',
        region: process.env.BACKBLAZE_BUCKET_REGION || ''
    },
});
