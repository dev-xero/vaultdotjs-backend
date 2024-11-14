import databaseProvider from '@database/database.provider';
import { User } from '@prisma/client';
import logger from '@utils/logger';

class UserHelper {
    private dbClient = databaseProvider.client;

    constructor() {}

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

    public async createUser(user: Partial<User>) {
        try {
            const record = await this.dbClient.user.create({
                data: {
                    username: user.username!,
                    password: user.password!,
                    createdAt: new Date(),
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
