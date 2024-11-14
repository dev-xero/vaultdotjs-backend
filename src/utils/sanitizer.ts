/**
 * This function takes in an object and returns a copy of it
 * excluding the specified keys.
 *
 * @param input the object to sanitize.
 * @param exclude fields (keys) to omit.
 * @returns a sanitized copy excluding those keys.
 */
export function sanitize<T>(input: T, exclude: (keyof T)[]): Partial<T> {
    const sanitizedObj = { ...input };

    exclude.forEach((key) => delete sanitizedObj[key]);

    return sanitizedObj;
}
