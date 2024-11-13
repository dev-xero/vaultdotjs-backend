import { docConfig, endpointsFiles, swaggerOutputFile } from './config';

import swaggerAutogen from 'swagger-autogen';
import fs from 'node:fs';
import path from 'node:path';

// Generates swagger spec based on endpoint and output files
async function generateSwaggerSpec() {
    const docsDirectory = 'src/docs/gen';

    if (!fs.existsSync(docsDirectory))
        fs.mkdirSync(path.join('src', 'docs', 'gen'));

    await swaggerAutogen({ openapi: '3.0.0' })(
        swaggerOutputFile,
        endpointsFiles,
        docConfig
    );
}

export default generateSwaggerSpec;
