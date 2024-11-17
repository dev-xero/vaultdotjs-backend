import { InternalServerError } from '@errors/internal.error';
import { Connection } from './connection.helper';

import rootDir from 'app-root-path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path, { parse } from 'node:path';
import logger from '@utils/logger';
import { BadRequestError } from '@errors/bad.request.error';
import { ApplicationError } from '@errors/application.error';

class EncryptionHelper {
    constructor() {}

    /**
     * This method processes an encrypted json string which contain
     * database connection details and attempts to decrypt and parse
     * that json.
     *
     * @param encryptedDetails Encrypted json containing the connection details
     * @returns The decrypted connection details
     */
    public async decryptConnectionDetails(
        encryptedDetails: string
    ): Promise<Required<Connection> | null> {
        try {
            const privateKey = fs.readFileSync(
                path.join(rootDir.toString(), 'private.pem'),
                'utf-8'
            );

            // the data we receive via http is a base64 string, we need the binary format
            const encryptedBinaryData = Buffer.from(encryptedDetails, 'base64');

            const decryptedData = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256',
                },
                encryptedBinaryData
            );

            const parsedDecryptedData = JSON.parse(decryptedData.toString());

            if (
                !(
                    parsedDecryptedData.hasOwnProperty('user') &&
                    parsedDecryptedData.hasOwnProperty('password')
                )
            ) {
                throw new BadRequestError('Malformed connection details.');
            }

            return parsedDecryptedData;
        } catch (err) {
            logger.error(err);

            if (err instanceof ApplicationError) {
                throw err;
            } else {
                throw new InternalServerError(
                    'Failed to decrypt connection details.'
                );
            }
        }
    }
}

const encryptionHelper = new EncryptionHelper();

export default encryptionHelper;
