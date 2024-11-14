import Joi from 'joi';

// Request body schema for signing up
export const signUpSchema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
    password: Joi.string().min(8).required(),
});
