import Joi from 'joi';

// Request body schema for refreshing tokens
export const refreshSchema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
});
