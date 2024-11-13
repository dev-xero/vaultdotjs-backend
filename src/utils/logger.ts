import { join } from 'path';
import { env } from '@config/variables';
import { createLogger, transports, format } from 'winston';

import root from 'app-root-path';

const { combine, printf, timestamp, colorize } = format;

/**
 * Provides a standard logging format.
 * @returns log format specifier for Winston.
 */
function logFormat() {
    return printf((info: any) => {
        return `${info.timestamp} ${info.level}: ${info.stack || info.message}`;
    });
}

/**
 * Intended for monitoring server logs in production environments.
 * @returns a production-level system logger.
 */
function productionLogger() {
    return createLogger({
        format: combine(colorize(), timestamp(), logFormat()),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: join(root.toString(), 'logs/prod.log'),
            }),
        ],
    });
}

/**
 * Intended to provide server log info in dev environments.
 * @returns a development-level system logger.
 */
function developmentLogger() {
    return createLogger({
        format: combine(colorize(), timestamp(), logFormat()),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: join(root.toString(), 'logs/dev.log'),
            }),
        ],
    });
}

// Provides dev or prod logger depending on env.
const logger = env.app.environment.isInDevelopment
    ? developmentLogger()
    : productionLogger();

export default logger;
