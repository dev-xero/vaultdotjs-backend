import { UnauthorizedRequestError } from '@errors/unauthorized.request.error';
import tokenHelper from '@helpers/token.helper';
import { NextFunction, Request, Response } from 'express';

/**
 * Responsible for providing authorization for protected routes,
 * verifies that an authorization bearer token exists then verifies that
 * the username matches the tokens.
 */
async function authorized(req: Request, res: Response, next: NextFunction) {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
    ) {
        throw new UnauthorizedRequestError('This endpoint is protected.');
    }

    // all protected endpoints need the username
    if (!req.body || !req.body.username) {
        throw new UnauthorizedRequestError(
            'Provide username for authentication.'
        );
    }

    const bearerToken = req.headers.authorization.split('Bearer ')[1];
    const decoded = await tokenHelper.verityToken(bearerToken);

    // must match
    if (!decoded) {
        throw new UnauthorizedRequestError('Token blacklisted.');
    }

    // decoded username must be sent username
    if (decoded.username != req.body.username) {
        throw new UnauthorizedRequestError('Invalid token.');
    }

    next();
}

export default authorized;
