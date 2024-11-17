import { InternalServerError } from '@errors/internal.error';
import { Connection } from './connection.helper';

import rootDir from 'app-root-path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import logger from '@utils/logger';

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

            const encryptedBinaryData = Buffer.from(encryptedDetails, 'base64');

            const decryptedData = crypto.privateDecrypt(
                {
                    key: privateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256',
                },
                encryptedBinaryData
            );

            console.log('decrypted:', decryptedData.toString());

            return null;
        } catch (err) {
            logger.error(err);
            throw new InternalServerError(
                'Failed to decrypt connection details.'
            );
        }
    }
}

const encryptionHelper = new EncryptionHelper();

export default encryptionHelper;
