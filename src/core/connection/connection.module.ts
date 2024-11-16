import authorized from '@middleware/authorization';
import rateLimited from '@middleware/ratelimiter';
import asyncHandler from '@utils/async.handler';
import { Router } from 'express';
import { establish } from './connection.service';

export const connectionRouter = Router();

connectionRouter.post(
    '/establish',
    /*
        #swagger.tags = ["Connection"]
        #swagger.summary = "Establishes a database connection. 200 on successful."
        #swagger.description = "Rate limited, requires authentication, this endpoint establishes a connection before users can dump or restore databases."
        #swagger.path = '/v1/connection/establish'
     */
    rateLimited,
    authorized,
    asyncHandler(establish)
);
