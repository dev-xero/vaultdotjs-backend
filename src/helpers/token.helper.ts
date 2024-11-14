import { env } from '@config/variables';
import { InternalServerError } from '@errors/internal.error';

import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import redisProvider from '@providers/redis.provider';

class TokenHelper {
    constructor() {}

    // Generates an access and refresh token from a username
    public generateTokens(username: string) {
        if (!env.tokens.accessKey || !env.tokens.refreshKey) {
            throw new InternalServerError(
                'Access or refresh token secret key is missing.'
            );
        }

        const payload = { username };

        const accessToken = jwt.sign(payload, env.tokens.accessKey, {
            expiresIn: '1hr',
        });

        const refreshToken = crypto
            .createHash('sha-256')
            .update(`${env.tokens.refreshKey}@${username}:${Date.now()}`)
            .digest('base64url');

        return [accessToken, refreshToken];
    }

    // Retrieve refresh token
    public async retrieveRefreshToken(
        username: string
    ): Promise<string | null> {
        return await redisProvider.client.get(username);
    }
}

const tokenHelper = new TokenHelper();

export default tokenHelper;
