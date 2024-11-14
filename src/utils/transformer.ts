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

/**
 * Removes special characters and replaces spaces to make strings
 * URL-friendly.
 *
 * @param unsafe Unsafe string.
 * @returns A url-safe string equivalent.
 */
export function makeURLSafe(unsafe: string): string {
    const safeString = unsafe;

    safeString
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, '') // removes all special characters
        .trim()
        .replace(/ /g, '-'); // replaces all spaces with dashes

    return safeString;
}
