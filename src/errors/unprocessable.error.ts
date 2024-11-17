import { ApplicationError } from './application.error';

import http from '@constants/http';

// Unprocessable request error wrapper
export class UnprocessableEntityError extends ApplicationError {
    constructor(message: string = 'Unprocessable request.') {
        super(message, http.UNPROCESSABLE);
    }
}
