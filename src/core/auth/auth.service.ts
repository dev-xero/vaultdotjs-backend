import http from '@constants/http';
import { BadRequestError } from '@errors/bad.request.error';
import userHelper from '@helpers/user.helper';
import logger from '@utils/logger';
import { Request, Response, NextFunction } from 'express';

/**
 * Processes a sign up request, validates the response body then creates
 * a new user after checks such as duplicates.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function signup(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    const isDuplicate = await userHelper.alreadyExists(
        req.body.username.toLowerCase()
    );

    if (isDuplicate) {
        throw new BadRequestError('This user already exists.');
    }

    const record = await userHelper.createUser({
        username: username.toLowerCase(),
        password,
    });

    logger.info('Successfully created new user.');

    return res.status(http.CREATED).json({
        status: 'success',
        message: 'Successfully created new user.',
        data: {
            username: record.username,
        },
    });
}
