import databaseProvider from '@database/database.provider';
import { User } from '@prisma/client';
import logger from '@utils/logger';
import { sanitize } from '@utils/sanitizer';

class UserHelper {
    private dbClient = databaseProvider.client;

    constructor() {}

    // Promises a boolean indicating whether a user with this username exists.
    public async alreadyExists(username: string): Promise<boolean> {
        try {
            const record = await this.dbClient.user.findUnique({
                where: {
                    username: username,
                },
            });

            return record != null;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    // Promises a user with the username or null if absent.
    public async findWithUsername(username: string): Promise<User | null> {
        try {
            const record = await this.dbClient.user.findUnique({
                where: {
                    username,
                },
            });

            return record;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    // Promises a partial user object after creating the record.
    public async createUser(user: Partial<User>): Promise<User> {
        try {
            const record = await this.dbClient.user.create({
                data: {
                    username: user.username!,
                    password: user.password!,
                    createdAt: new Date(),
                },
                include: {
                    connections: true,
                },
            });

            return record;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}

const userHelper = new UserHelper();

export default userHelper;
