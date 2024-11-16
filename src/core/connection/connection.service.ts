import http from '@constants/http';
import { NextFunction, Request, Response } from 'express';

export async function establish(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(http.OK).json({
        message: 'Yet to be implemented.',
    });
}
