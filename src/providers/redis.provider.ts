import { env } from '@config/variables';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

import logger from '@utils/logger';

/**
 * Provides and manages an active Redis connection.
 */
class RedisProvider {
    private redisClient: RedisClientType;

    constructor() {}

    public get client() {
        return this.redisClient;
    }

    public async connect() {
        this.redisClient = await createClient({
            url: env.redisURI,
        });

        this.redisClient.on('error', (err: any) => {
            logger.error('Failed to connect Redis.');
            throw err;
        });

        this.redisClient.on('connect', () =>
            logger.info('Redis connected successfully.')
        );

        await this.redisClient.connect();
    }
}

const redisProvider = new RedisProvider();

export default redisProvider;
