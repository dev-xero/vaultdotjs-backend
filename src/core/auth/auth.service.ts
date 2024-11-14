import http from '@constants/http';
import { BadRequestError } from '@errors/bad.request.error';
import passwordHelper from '@helpers/password.helper';
import userHelper from '@helpers/user.helper';
import logger from '@utils/logger';
import { Request, Response, NextFunction } from 'express';

/**
 * Processes a sign up request, validates the response body then creates
 * a new user after checks such as duplicates.
 *
 * - First start by validating the request body to make sure username and password is provided.
 * - Check for account duplicates via the username.
 * - If no accounts with that username exists, then create a new user account.
 * - Generate and store a new access and refresh token.
 * - The access token is stored in a redis cache for about 1hr.
 * - Responds with the access and refresh tokens.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function signup(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    const isDuplicate = await userHelper.alreadyExists(username.toLowerCase());

    if (isDuplicate) throw new BadRequestError('This user already exists.');

    const hashedPassword = passwordHelper.hash(password);

    const record = await userHelper.createUser({
        username: username.toLowerCase(),
        password: hashedPassword,
    });

    // generate tokens here

    logger.info('Successfully created new user.');

    return res.status(http.CREATED).json({
        status: 'success',
        message: 'Successfully created new user.',
        code: http.CREATED,
        data: {
            username: record.username,
        },
    });
}
