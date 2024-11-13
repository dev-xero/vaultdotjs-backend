import { ApplicationError } from './application.error';

import http from '@constants/http';

// Bad request error wrapper
export class BadRequestError extends ApplicationError {
    constructor(message: string = 'Bad Request.') {
        super(message, http.BAD_REQUEST);
    }
}
