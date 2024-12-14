import Joi from 'joi';

// Request body schema for backing up databases
export const BackUpSchema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
    tables: Joi.string().required(),
});
