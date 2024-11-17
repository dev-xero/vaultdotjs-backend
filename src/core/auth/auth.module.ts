import { Router } from 'express';
import { refresh, signin, signup } from './auth.service';
import { signUpSchema } from '@validators/signup.schema';

import asyncHandler from '@utils/async.handler';
import rateLimited from '@middleware/ratelimiter';
import validated from '@middleware/validator';
import { signInSchema } from '@validators/signin.schema';
import { refreshSchema } from '@validators/refresh.schema';

export const authRouter = Router();

authRouter.post(
    '/signup',
    /*
        #swagger.tags = ["Auth"]
        #swagger.summary = "Creates a new user, returns 201 on successful."
        #swagger.description = "Rate limited, this endpoint is responsible for creating new users, it triggers validation checks before doing so. Default response code is 201."
        #swagger.path = '/v1/auth/signup'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/authBody"
                    }
                }
            }
        }
     */
    rateLimited,
    validated(signUpSchema),
    asyncHandler(signup)
);

authRouter.post(
    '/signin',
    /*
        #swagger.tags = ["Auth"]
        #swagger.summary = "Signs in existing users, returns 200 on successful."
        #swagger.description = "Rate limited, this endpoint is responsible for singing validated users. Default response code is 200."
        #swagger.path = '/v1/auth/signin'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/authBody"
                    }
                }
            }
        }
     */
    rateLimited,
    validated(signInSchema),
    asyncHandler(signin)
);

authRouter.post(
    '/refresh',
    /*
        #swagger.tags = ["Auth"]
        #swagger.summary = "Generates new refresh and access tokens for users."
        #swagger.description = "Rate limited, this endpoint can be called to generate a new refresh and access token when both have expired."
        #swagger.push = '/v1/auth/refresh'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: '#/components/schemas/refreshBody'
                    }
                }
            }
        }
     */
    rateLimited,
    validated(refreshSchema),
    asyncHandler(refresh)
);
