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

/**
 * Responsible for providing the appropriate database connections, currently handles:
 * - Pgsql
 * - MongoDB
 * - MySQL
 */
class ConnectionHelper {
    constructor() {}

    // Attempts to connect to a pgsql database pool
    public async connectPgsql(conn: PartialPgsqlConnection) {        
        const connectionDetails = {
            ...conn,
            ssl: { rejectUnauthorized: false },
        }

        // Remove port if it is '0000'
        if (connectionDetails.port == '0000') {
            delete connectionDetails.port;
        } else {
            connectionDetails.port = parseInt(connectionDetails.port as string, 10);
        }

        const pool = new pg.Pool(connectionDetails as PgsqlConnection);

        return await pool.connect();
    }
}

const connectionHelper = new ConnectionHelper();

export default connectionHelper;
