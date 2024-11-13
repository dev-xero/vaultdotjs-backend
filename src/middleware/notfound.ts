import http from '@constants/http';
import { NextFunction, Response, Request } from 'express';

// Responsible for handling undefined routes.
function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(http.NOT_FOUND).json({
        status: 'not_found',
        message: 'This endpoint does not exist.',
        code: http.NOT_FOUND,
    });
}

export default notFoundHandler;
