import { ApplicationError } from '@errors/application.error';
import { NextFunction, Request, Response } from 'express';

import http from '@constants/http';
import logger from '@utils/logger';
import redisProvider from '@providers/redis.provider';
import { BadRequestError } from '@errors/bad.request.error';
import connectionHelper from '@helpers/connection.helper';
import { backupPgSQLDatabase } from '@utils/backup.database';

/**
 * Firstly, check to ensure the user session is valid (younger than 10 mins).
 * Retrieve the connection details from redis and then perform database backup
 * after establishing a new connection.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function backupPgsql(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { username } = req.body;
        // Check if the connection details exist for this user
        const savedDetails = await redisProvider.client.hget(
            `connection:${username}`,
            'connection'
        );

        if (!savedDetails) {
            throw new BadRequestError(
                'Connection session expired, please reconnect.'
            );
        }

        const connectionDetails = JSON.parse(savedDetails);
        
        const report = await backupPgSQLDatabase(connectionDetails);

        res.status(http.OK).json({
            status: 'success',
            message: 'successfully backed up database.',
            report,
            blob_link: '',
        });
    } catch (err) {
        logger.error(err);

        if (err instanceof ApplicationError && err.statusCode != 500) {
            throw err;
        } else {
            res.status(http.INTERNAL_SERVER_ERROR).json({
                status: 'internal_server_error',
                message: 'An internal server error has occurred.',
                code: http.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
