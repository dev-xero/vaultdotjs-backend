import { env } from '@config/variables';

export const swaggerOutputFile = 'src/docs/gen/swagger.json';

export const endpointsFiles = [
    'src/core/app/app.module.ts',
    'src/core/auth/auth.module.ts',
];

export const docConfig = {
    info: {
        title: 'Vault.js Backend API',
        description: 'Swagger API documentation for Vault.js',
    },
    host: `${env.app.hostname}:8000`,
};
