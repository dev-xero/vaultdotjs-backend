import { ApplicationError } from '@errors/application.error';
import { UnprocessableEntityError } from '@errors/unprocessable.error';
import { NextFunction, Request, Response } from 'express';

import http from '@constants/http';
import connectionHelper, { PgsqlConnection } from '@helpers/connection.helper';
import encryptionHelper from '@helpers/encryption.helper';
import logger from '@utils/logger';

/**
 * Processes and tries to establish a database connection.
 * Connection details are sent encrypted, so of course we need to decrypt
 * it using the server's private key.
 *
 * It handles connecting to pgsql, mongodb and mysql databases.
 *
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function establish(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const connectionDetails =
            await encryptionHelper.decryptConnectionDetails(req.body.details);

        // if for whatever reason we still don't have the details, terminate the request
        if (!connectionDetails) {
            throw new UnprocessableEntityError(
                'Connection details could not be validated.'
            );
        }

        switch (req.body.type) {
            case 'pgsql':
                await connectionHelper.connectPgsql(
                    connectionDetails as PgsqlConnection
                );
                break;

            default:
                throw new UnprocessableEntityError(
                    'Something went wrong with this request.'
                );
        }

        res.status(http.OK).json({
            status: http.OK,
            message: 'Successfully verified connection.',
            code: http.OK,
        });
    } catch (err) {
        logger.error(err);

        if (err instanceof ApplicationError && err.statusCode != 500) {
            throw err;
        } else {
            res.status(http.UNPROCESSABLE).json({
                status: 'connection_error',
                message: 'This connection could not be established.',
                code: http.UNPROCESSABLE,
            });
        }
    }
}
