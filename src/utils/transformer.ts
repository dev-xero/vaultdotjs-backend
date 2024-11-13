import { ValidationResult } from 'joi';

/**
 * This function takes in a joi validation result and returns string escaped
 * error messages.
 * @param result Joi validation result.
 */
export function extractJoiMessage(result: ValidationResult): string {
    return result.error
        ? `${result.error.details[0].message.replace(/"/g, '')}.`
        : '';
}
