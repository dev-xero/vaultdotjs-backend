import http from '@constants/http';
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
    throw new Error("hahaha");
    // return res.status(http.OK).json({
    //     status: 'success',
    //     message: 'User account created successfully.',
    //     code: http.OK,
    // });
}