import { docConfig, endpointsFiles, swaggerOutputFile } from './config';

import swaggerAutogen from 'swagger-autogen';
import fs from 'node:fs';
import path from 'node:path';

// This happens when run from a script

const docsDirectory = 'src/docs/gen';

if (!fs.existsSync(docsDirectory))
    fs.mkdirSync(path.join('src', 'docs', 'gen'));

swaggerAutogen({ openapi: '3.0.0' })(
    swaggerOutputFile,
    endpointsFiles,
    docConfig
);
