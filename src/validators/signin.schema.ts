import Joi from 'joi';

// Request body schema for signing in
export const signInSchema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
    password: Joi.string().min(8).required(),
});