import { connectionSchema } from '@validators/connection.schema';
import { Router } from 'express';
import { establish } from './connection.service';

import authorized from '@middleware/authorization';
import rateLimited from '@middleware/ratelimiter';
import validated from '@middleware/validator';
import asyncHandler from '@utils/async.handler';

export const connectionRouter = Router();

connectionRouter.post(
    '/establish',
    /*
        #swagger.tags = ["Connection"]
        #swagger.summary = "Establishes a database connection. 200 on successful."
        #swagger.description = "Rate limited, requires authentication, this endpoint establishes a connection before users can dump or restore databases."
        #swagger.path = "/v1/connection/establish"
     */
    rateLimited,
    authorized,
    validated(connectionSchema),
    asyncHandler(establish)
);
