import authorized from '@middleware/authorization';
import rateLimited from '@middleware/ratelimiter';
import validated from '@middleware/validator';
import { connectionSchema } from '@validators/connection.schema';
import { Router } from 'express';
import { backup } from './backup.service';
import asyncHandler from '@utils/async.handler';

export const backupRouter = Router();

backupRouter.post(
    '/',
    /*
        #swagger.tags = ["Backup"]
        #swagger.summary = "Attempts to backup a database after connection"
        #swagger.description = "Rate limited, requires authentication, this endpoint attempts to backup a database after a connection has been established."
        #swagger.path = "/v1/backup"
     */
    rateLimited,
    authorized,
    validated(connectionSchema),
    asyncHandler(backup)
);
