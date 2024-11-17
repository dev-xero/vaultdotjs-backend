import pg from 'pg';

export interface Connection {
    user: string;
    password: string;
}

export interface PgsqlConnection extends Connection {
    host: string;
    port: number;
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
    public async connectPgsql(conn: PgsqlConnection) {
        const pool = new pg.Pool({
            ...conn,
            ssl: { rejectUnauthorized: false },
        });

        return await pool.connect();
    }
}

const connectionHelper = new ConnectionHelper();

export default connectionHelper;
