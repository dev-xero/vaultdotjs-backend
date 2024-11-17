import http from '@constants/http';
import connectionHelper from '@helpers/connection.helper';
import encryptionHelper from '@helpers/encryption.helper';
import logger from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

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

        // await connectionHelper.connectPgsql();

        res.status(http.OK).json({
            status: http.OK,
            message: 'Successfully verified connection.',
            code: http.OK,
        });
    } catch (err) {
        logger.error(err);

        res.status(http.UNPROCESSABLE).json({
            status: 'connection_error',
            message: 'This connection could not be established.',
            code: http.UNPROCESSABLE,
        });
    }
}
