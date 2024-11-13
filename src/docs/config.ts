import { env } from '@config/variables';

export const outputFile = 'src/docs/gen/swagger.json';
export const endpointsFiles = ['src/core/app/app.module.ts'];
export const docConfig = {
    info: {
        title: 'Vault.js Backend API',
        description: 'Swagger API documentation for Vault.js',
    },
    host: env.app.hostname,
};
