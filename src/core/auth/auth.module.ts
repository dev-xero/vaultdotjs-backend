import { Router } from 'express';
import { signup } from './auth.service';
import { signUpSchema } from '@validators/signup.schema';

import asyncHandler from '@utils/async.handler';
import rateLimited from '@middleware/ratelimiter';
import validated from '@middleware/validator';

export const authRouter = Router();

authRouter.post(
    '/signup',
    /**
     * #swagger.tags = ["Auth"]
     * #swagger.summary = "Creates a new user, returns 201 on successful."
     * #swagger.description = "Rate limited, This endpoint is responsible for creating new users, it triggers validation checks before doing so. Default response code is 201."
     * #swagger.path = '/v1/auth/signup'
     */
    rateLimited,
    validated(signUpSchema),
    asyncHandler(signup)
);
