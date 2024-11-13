import { ApplicationError } from './application.error';

import http from '@constants/http';

// Non-existent endpoint error wrapper
export class NotFoundError extends ApplicationError {
    constructor(message: string = 'Not Found.') {
        super(message, http.NOT_FOUND);
    }
}
