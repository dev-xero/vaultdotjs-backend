import rateLimit from 'express-rate-limit';

/**
 * Rate limit middleware for requests, this configuration allows only 100 requests
 * every 15 mins.
 */
const rateLimited = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        message: 'You are being rate limited.',
        success: false,
    },
});

export default rateLimited;
