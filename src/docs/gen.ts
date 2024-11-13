import swaggerAutogen from 'swagger-autogen';
import { endpointsFiles, outputFile } from './config';

// This happens when run from a script
swaggerAutogen(outputFile, endpointsFiles);
