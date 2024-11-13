import { ApplicationError } from './application.error';

import http from '@constants/http';

// Internal server error wrapper
export class InternalServerError extends ApplicationError {
    constructor(message: string = 'Internal Server Error.') {
        super(message, http.INTERNAL_SERVER_ERROR, false);
    }
}
