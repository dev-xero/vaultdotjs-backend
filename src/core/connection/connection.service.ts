import http from '@constants/http';
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
    res.status(http.OK).json({
        message: 'Yet to be implemented.',
    });
}
