import connectionHelper, { PgsqlConnection } from '@helpers/connection.helper';
import { createWriteStream } from 'node:fs';

import fs from 'node:fs/promises';
import path from 'node:path';
import logger from './logger';
import rootDir from 'app-root-path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { promisify } from 'node:util';

const pipe = promisify(pipeline);

export async function backupPgSQLDatabase(connDetails: PgsqlConnection) {
    const client = await connectionHelper.connectPgsql(connDetails);
    try {
        // construct backup directory
        const backupDirectory = path.join(
            rootDir.toString(),
            'backups',
            'pgsql',
            connDetails.user,
            connDetails.database
        );

        await ensureBackupDirectoryExists(backupDirectory);

        const backupFilePath = path.join(
            backupDirectory,
            `${connDetails.user}-${
                connDetails.database
            }-at-${Date.now()}.sql.gz`
        );

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

        gzipStream.end();

        // Generate blob link
        

        return report;
    } catch (err) {
        logger.error(
            `Backup for database: ${connDetails.database} failed to complete.`
        );
        throw err;
    }
}

// ---------------- UTILITIES -------------------------- //
async function ensureBackupDirectoryExists(backupPath: string) {
    try {
        await fs.mkdir(backupPath, { recursive: true });
        logger.info('Backup directory exists.');
    } catch (err) {
        logger.error('Failed to ensure backup directory exists.');
        throw err;
    }
}
