import http from '@constants/http';
import { BadRequestError } from '@errors/bad.request.error';
import { InternalServerError } from '@errors/internal.error';
import passwordHelper from '@helpers/password.helper';
import tokenHelper from '@helpers/token.helper';
import userHelper from '@helpers/user.helper';
import redisProvider from '@providers/redis.provider';
import logger from '@utils/logger';
import { sanitize } from '@utils/sanitizer';
import { makeURLSafe } from '@utils/transformer';
import { Request, Response, NextFunction } from 'express';

/**
 * Processes a sign up request, validates the response body then creates
 * a new user after checks such as duplicates.
 *
 * - First start by validating the request body to make sure username and password is provided.
 * - Check for account duplicates via the username.
 * - If no accounts with that username exists, then create a new user account.
 * - Generate and store a new access and refresh token.
 * - The refresh token is stored in a redis cache for 2 days.
 * - Responds with the access and refresh tokens.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function signup(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    const urlSafeUsername = makeURLSafe(username);
    const isDuplicate = await userHelper.alreadyExists(username.toLowerCase());

    if (isDuplicate) throw new BadRequestError('This user already exists.');

    // we will not store the passwords as plain text, instead, hash them
    const hashedPassword = passwordHelper.hash(password);

    const newUser = await userHelper.createUser({
        username: urlSafeUsername,
        password: hashedPassword,
    });

    // access and refresh tokens generated here
    const [accessToken, refreshToken] = tokenHelper.generateTokens(username);

    if (!accessToken || !refreshToken) {
        throw new InternalServerError('Failed to generate user tokens.');
    }

    await redisProvider.client.set(urlSafeUsername, refreshToken);
    await redisProvider.client.expire(urlSafeUsername, 172800); // expires in 2 days

    // request is completed
    logger.info('User created successfully.');

    return res.status(http.CREATED).json({
        status: 'success',
        message: 'Successfully created new user.',
        code: http.CREATED,
        data: {
            user: sanitize(newUser, ['password', 'createdAt']),
            accessToken,
            refreshToken,
        },
    });
}

/**
 * Processes signin requests, request body validation and other internal checks
 * before providing an access and refresh token.
 *
 * - Check that the user exists.
 * - Validate password match.
 * - Retrieve refresh token from redis.
 * - Generate a new access token and return user data.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function signin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    const storedUser = await userHelper.findWithUsername(username);

    if (!storedUser) throw new BadRequestError('This user does not exist.');

    const doesPasswordsMath = passwordHelper.matches(
        storedUser.password,
        password
    );

    if (!doesPasswordsMath) throw new BadRequestError('Passwords mismatch.');

    const cachedRefreshToken = await tokenHelper.retrieveRefreshToken(username);
    const [accessToken, genRefresh] = tokenHelper.generateTokens(username);
    
    const refreshToken = cachedRefreshToken ? cachedRefreshToken : genRefresh;

    if (cachedRefreshToken) logger.info('refresh token still exists, reusing.');

    logger.info('User signed in successfully.');

    res.status(http.OK).json({
        status: 'success',
        message: 'Successfully signed in.',
        code: http.OK,
        data: {
            user: sanitize(storedUser, ['password', 'createdAt']),
            accessToken,
            refreshToken,
        },
    });
}
