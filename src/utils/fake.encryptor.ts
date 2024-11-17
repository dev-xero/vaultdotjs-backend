// This file is strictly for generating encrypted data using the public key

import rootDir from 'app-root-path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const fakeConnectionData = {
    user: 'secureUser',
    password: 'securePassword',
    database: 'secureDatabase',
    host: 'secureHost',
    port: 5432,
};

const publicKey = fs.readFileSync(path.join(rootDir.toString(), 'public.pem'));

const encryptedData = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    },
    Buffer.from(JSON.stringify(fakeConnectionData), 'utf-8')
);

console.log('Encrypted (fake):', encryptedData.toString('base64'));
