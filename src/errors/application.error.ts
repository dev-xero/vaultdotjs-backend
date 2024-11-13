/**
 * This abstract class extends the default error object to adapt for API errors.
 *
 * @property message The error message propagated when it is instantiated.
 * @property statusCode Http error code.
 * @property isOperational Specifies if the error is expected or not, like request validation failures etc.
 */
export abstract class ApplicationError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number,
        isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore the inheritance chain

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}
