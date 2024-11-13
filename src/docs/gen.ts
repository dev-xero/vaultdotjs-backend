import swaggerAutogen from 'swagger-autogen';
import { endpointsFiles, swaggerOutputFile } from './config';

// This happens when run from a script
swaggerAutogen(swaggerOutputFile, endpointsFiles);
