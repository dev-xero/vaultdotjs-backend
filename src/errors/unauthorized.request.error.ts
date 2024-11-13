import { ApplicationError } from './application.error';

import http from '@constants/http';

// Unauthorized request error wrapper
export class UnauthorizedRequestError extends ApplicationError {
    constructor(message: string = 'Unauthorized Request.') {
        super(message, http.UNAUTHORIZED);
    }
}
