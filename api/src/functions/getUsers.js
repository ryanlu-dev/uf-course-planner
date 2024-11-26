const { Client } = require('pg');

module.exports = async function (context, req) {
    const client = new Client({
        connectionString: process.env.DATABASE_CONNECTION_STRING, // Use environment variable for the connection string
        ssl: { rejectUnauthorized: false }, // Optional: Adjust SSL settings based on your PostgreSQL configuration
    });

    try {
        await client.connect();
        const result = await client.query('SELECT * FROM users'); // Replace with your query
        context.res = {
            status: 200,
            body: result.rows,
        };
    } catch (error) {
        context.log('Error connecting to the database:', error);
        context.res = {
            status: 500,
            body: 'Database connection error: ' + error.message,
        };
    } finally {
        await client.end();
    }
};