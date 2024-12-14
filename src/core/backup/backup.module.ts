import authorized from '@middleware/authorization';
import rateLimited from '@middleware/ratelimiter';
import validated from '@middleware/validator';
import { connectionSchema } from '@validators/connection.schema';
import { Router } from 'express';
import { backupPgsql } from './backup.service';
import asyncHandler from '@utils/async.handler';
import { BackUpSchema } from '@validators/backup.schema';

export const backupRouter = Router();

backupRouter.post(
    '/pgsql',
    /*
        #swagger.tags = ["Backup"]
        #swagger.summary = "Attempts to backup a database after connection"
        #swagger.description = "Rate limited, requires authentication, this endpoint attempts to backup a database after a connection has been established."
        #swagger.path = "/v1/backup"
     */
    rateLimited,
    authorized,
    validated(BackUpSchema),
    asyncHandler(backupPgsql)
);
