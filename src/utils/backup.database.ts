import connectionHelper, {
    MongoDBConnection,
    PgsqlConnection,
} from '@helpers/connection.helper';
import { createWriteStream } from 'node:fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { promisify } from 'node:util';
import { env } from '@config/variables';

import fs from 'node:fs/promises';
import path from 'node:path';
import logger from './logger';
import rootDir from 'app-root-path';
import B2 from 'backblaze-b2';

const pipe = promisify(pipeline);

// BackBlaze B2 Configuration
const b2 = new B2({
    applicationKeyId: env.b2.applicationKeyId,
    applicationKey: env.b2.applicationKey,
});

export async function backupPgSQLDatabase(connDetails: PgsqlConnection) {
    const client = await connectionHelper.connectPgsql(connDetails);
    try {
        // Initialize backblaze
        const b2Auth = await b2.authorize();
        const downloadURL = b2Auth.data.downloadUrl;

        // construct backup directory
        const backupDirectory = path.join(
            rootDir.toString(),
            'backups',
            'pgsql',
            connDetails.user,
            connDetails.database
        );

        await ensureBackupDirectoryExists(backupDirectory);

        const backupFileName = `${connDetails.user}-${
            connDetails.database
        }-at-${Date.now()}.sql.gz`;

        const backupFilePath = path.join(backupDirectory, backupFileName);

        // Create write and gzip stream for compression
        const writeStream = createWriteStream(backupFilePath);
        const gzipStream = createGzip();

        // Pipe lines to pipe data through gzip stream to write
        pipe(gzipStream, writeStream);

        const report = [];

        const tables = await client.query(
            `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
            `
        );

        logger.info(`Preparing to backup ${tables.rowCount} tables.`);

        for (const table of tables.rows) {
            const tableName = table.table_name;

            try {
                const rows = await client.query(
                    `SELECT * FROM "${tableName}"\n`
                );

                console.info(
                    `Found ${rows.rowCount} rows for table: ${tableName}`
                );

                // Write table data header into gzip stream
                gzipStream.write(`\n-- Data for table: ${tableName}\n`);

                // Write INSERT statements for each row
                for (const row of rows.rows) {
                    const values = Object.values(row)
                        .map((v) => (v === null ? 'NULL' : `'${v}'`))
                        .join(', ');
                    gzipStream.write(
                        `INSERT INTO "${tableName}" VALUES (${values});\n`
                    );
                }

                report.push({
                    table: tableName,
                    status: 'successfully backed up.',
                    completedOn: new Date(),
                });

                logger.info(
                    `Backup completed successfully for table: ${tableName}`
                );
            } catch (err) {
                console.warn(
                    `Skipping table "${tableName}" due to error: ${err.message}`
                );
            }
        }

        await new Promise((resolve, reject) => {
            gzipStream.on('finish', resolve);
            gzipStream.on('error', reject);
            gzipStream.end();
        });

        // Upload backup file to backblaze
        const uploadResponse = await uploadToBackblaze(
            backupFilePath,
            backupFileName
        );

        // Generate signedURL for the file
        const signedURL = await generateSignedURL(
            uploadResponse.fileName,
            downloadURL
        );

        return {
            report,
            blob_link: signedURL,
        };
    } catch (err) {
        logger.error(
            `Backup for database: ${connDetails.database} failed to complete.`
        );
        throw err;
    }
}

export async function backupMongoDatabase(connDetails: MongoDBConnection) {
    const client = await connectionHelper.connectMongoDB(connDetails);

    try {
        const db = client.db(connDetails.database);
        const collections = await db.listCollections().toArray();

        const b2Auth = await b2.authorize();
        const downloadURL = b2Auth.data.downloadUrl;

        const backupDirectory = path.join(
            rootDir.toString(),
            'backups',
            'mongo',
            connDetails.user,
            connDetails.database
        );

        await ensureBackupDirectoryExists(backupDirectory);

        const backupFileName = `${connDetails.user}-${
            connDetails.database
        }-at-${Date.now()}.json.gz`;

        const backupFilePath = path.join(backupDirectory, backupFileName);

        // Create write and gzip streams
        const writeStream = createWriteStream(backupFilePath);
        const gzipStream = createGzip();

        pipe(gzipStream, writeStream);

        const report = [];

        // Write contents to file
        for (const collection of collections) {
            const coll = db.collection(collection.name);
            const cursor = coll.find();

            for await (const doc of cursor) {
                gzipStream.write(JSON.stringify(doc) + '\n');
            }

            report.push({
                collection: collection.name,
                status: 'successfully backed up.',
                completedOn: new Date(),
            });

            logger.info(`Backup completed for collection: ${collection.name}`);
        }

        // Finalize gzip stream ahahahah
        await new Promise((resolve, reject) => {
            gzipStream.on('finish', resolve);
            gzipStream.on('error', reject);
            gzipStream.end();
        });

        // Upload backup file to backblaze
        const uploadResponse = await uploadToBackblaze(
            backupFilePath,
            backupFileName
        );

        // Generate signedURL for the file
        const signedURL = await generateSignedURL(
            uploadResponse.fileName,
            downloadURL
        );

        return {
            report,
            blob_link: signedURL,
        };
    } catch (err) {
        logger.error(
            `Backup for database (mongo): ${connDetails.database} failed to complete.`
        );
        throw err;
    }
}

// ---------------- UTILITIES -------------------------- //
async function uploadToBackblaze(filePath: string, fileName: string) {
    const bucketId = env.b2.bucketId;

    const fileBuffer = await fs.readFile(filePath);
    const uploadURLResponse = await b2.getUploadUrl({ bucketId });

    // Upload to backblaze servers
    const uploadResponse = await b2.uploadFile({
        uploadUrl: uploadURLResponse.data.uploadUrl,
        uploadAuthToken: uploadURLResponse.data.authorizationToken,
        fileName,
        data: fileBuffer,
    });

    logger.info(`File uploaded successfully: ${fileName}`);

    return uploadResponse.data;
}

async function generateSignedURL(fileName: string, downloadURL: string) {
    // await debugBucketInfo();
    const validDurationInSeconds = 3600; // 1 hour validity

    const downloadAuth = await b2.getDownloadAuthorization({
        bucketId: env.b2.bucketId,
        fileNamePrefix: fileName,
        validDurationInSeconds,
    });

    const downloadUrl = `${downloadURL}/file/vaultdotjs-store/${fileName}`;

    return `${downloadUrl}?Authorization=${downloadAuth.data.authorizationToken}`;
}

async function ensureBackupDirectoryExists(backupPath: string) {
    try {
        await fs.mkdir(backupPath, { recursive: true });
        logger.info('Backup directory exists.');
    } catch (err) {
        logger.error('Failed to ensure backup directory exists.');
        throw err;
    }
}

// DEBUGGING PURPOSES
async function debugBucketInfo() {
    try {
        const buckets = await b2.listBuckets();
        console.log('Available Buckets:', buckets.data.buckets);

        console.log('Attempted Bucket Name:', env.b2.bucketName);
    } catch (error) {
        console.error('Error listing buckets:', error);
    }
}
