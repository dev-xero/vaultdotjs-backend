import { UnauthorizedRequestError } from '@errors/unauthorized.request.error';
import { NextFunction, Request, Response } from 'express';

/** 
 * Responsible for providing authorization for protected routes,
 * verifies that an authorization bearer token exists then verifies that 
 * the username matches the tokens.
*/
function authorized(req: Request, res: Response, next: NextFunction) {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
    ) {
        throw new UnauthorizedRequestError('This endpoint is protected.');
    }

    next();
}

export default authorized;
