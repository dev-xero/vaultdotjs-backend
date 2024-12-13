import { env } from '@config/variables';
import Redis from "ioredis";


import logger from '@utils/logger';
import { InternalServerError } from '@errors/internal.error';

/**
 * Provides and manages an active Redis connection.
 */
class RedisProvider {
    private redisClient: Redis;

    constructor() {}

    // Public accessor method for the redis client
    public get client() {
        return this.redisClient;
    }

    // Setups redis server connection
    public async connect() {
        if (!env.redisURI) {
            throw new InternalServerError("Redis URI is missing.");
        }

        this.redisClient = new Redis(env.redisURI);

        this.redisClient.on('error', (err: any) => {
            logger.error('Failed to connect Redis.');
            throw err;
        });

        this.redisClient.on('connect', () =>
            logger.info('Redis connected successfully.')
        );
    }
}

const redisProvider = new RedisProvider();

export default redisProvider;
