import rateLimited from '@middleware/ratelimiter';
import { Router } from 'express';

export const connectionRouter = Router();

connectionRouter.post(
    '/establish',
    /*
        #swagger.tags = ["Connection"]
        #swagger.summary = "Establishes a database connection. 200 on successful."
        #swagger.description = "Rate limited, this endpoint establishes a connection before users can dump or restore databases."
        #swagger.path = "/v1/connection/establish"
    */
    rateLimited
);
