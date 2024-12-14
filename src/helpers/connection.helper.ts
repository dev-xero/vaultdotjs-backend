import { MongoClient } from 'mongodb';
import pg from 'pg';

export interface Connection {
    user: string;
    password: string;
}

export interface PgsqlConnection extends Connection {
    host: string;
    port: number | undefined;
    database: string;
}

interface PartialPgsqlConnection extends Connection {
    host: string;
    port?: string | number;
    database: string;
}

export interface MongoDBConnection extends Connection {
    host: string;
    port?: string | number;
    database: string;
}

/**
 * Responsible for providing the appropriate database connections, currently handles:
 * - Pgsql
 * - MongoDB
 * - MySQL
 */
class ConnectionHelper {
    constructor() {}

    /**
     * Attempts to connect to a pgsql database pool
     *
     * @param conn PostgreSQL connection details.
     * @returns Promisified connection client.
     */
    public async connectPgsql(conn: PartialPgsqlConnection) {
        const connectionDetails = {
            ...conn,
            ssl: { rejectUnauthorized: false },
        };

        // Remove port if it is '0000'
        if (connectionDetails.port == '0000') {
            delete connectionDetails.port;
        } else {
            connectionDetails.port = parseInt(
                connectionDetails.port as string,
                10
            );
        }

        const pool = new pg.Pool(connectionDetails as PgsqlConnection);

        return await pool.connect();
    }

    /**
     * Attempts to connect to a mongo db database.
     *
     * @param conn MongoDB connection details.
     * @returns Promisified connection client.
     */
    public async connectMongoDB(conn: MongoDBConnection) {
        const { user, password, host, port, database } = conn;

        // Build connection URI
        const uri = `mongodb+srv://${user}:${encodeURIComponent(password)}@${host}${
            port ? `:${port}` : ''
        }/?retryWrites=true&w=majority&appName=Home`;

        const client = new MongoClient(uri);

        return await client.connect();
    }
}

const connectionHelper = new ConnectionHelper();

export default connectionHelper;
