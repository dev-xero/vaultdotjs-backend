import swaggerAutogen from 'swagger-autogen';
import { docConfig, endpointsFiles, swaggerOutputFile } from './config';

// This happens when run from a script
swaggerAutogen({ openapi: '3.0.0' })(
    swaggerOutputFile,
    endpointsFiles,
    docConfig
);
