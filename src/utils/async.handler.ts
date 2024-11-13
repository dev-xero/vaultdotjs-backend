import { NextFunction, Request, Response } from 'express';

type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

// Wrapper around asynchronous requests
function asyncHandler(execute: AsyncFunction) {
    return (req: Request, res: Response, next: NextFunction) => {
        execute(req, res, next).catch(next);
    };
}

export default asyncHandler;
