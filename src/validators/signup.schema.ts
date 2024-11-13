import Joi from 'joi';

export const signUpSchema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
    password: Joi.string().min(8).required(),
});
