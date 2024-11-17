import Joi from 'joi';

// Request body schema for establishing connections
export const connectionSchema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
    type: Joi.string().valid('pgsql', 'mongo', 'mysql').required(),
    details: Joi.string().required(),
});
