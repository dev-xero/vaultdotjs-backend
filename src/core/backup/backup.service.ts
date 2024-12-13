import { ApplicationError } from "@errors/application.error";
import { NextFunction, Request, Response } from "express";

import http from "@constants/http";
import logger from "@utils/logger";

/**
 * 
 * 
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export async function backup(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

    } catch (err) {
        logger.error(err);

        if (err instanceof ApplicationError && err.statusCode != 500) {
            throw err;
        } else {
            res.status(http.INTERNAL_SERVER_ERROR).json({
                status: 'internal_server_error',
                message: 'An internal server error has occurred.',
                code: http.INTERNAL_SERVER_ERROR
            })
        }
    }
}