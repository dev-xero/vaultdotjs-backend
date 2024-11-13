// Server CORS configuration options.
const corsOptions = {
    origin: ['http://localhost:3456'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
