import { PrismaClient } from '@prisma/client';
import logger from '@utils/logger';

/**
 * This class manages and provides a PostgreSQL database connection.
 * The prisma property represents a db client connection used to make database requests.
 * Once instantiated, the provider will attempt to connect to the database -- discards
 * the setup if it is unsuccessful.
 */
class DatabaseProvider {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public get client() {
        return this.prisma;
    }

    public async connect() {
        await this.prisma.$connect().catch((err) => {
            logger.error('Database connection failed.');
            throw err;
        });

        logger.info('Database connected successfully.');
    }
}

const databaseProvider = new DatabaseProvider();

export default databaseProvider;
