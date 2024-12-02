const { Client } = require('pg');
const fs = require('fs');

module.exports = async function (context, req) {
    var client = new Client({host:process.env.DB_HOSTNAME, user:process.env.DB_USER, password:process.env.DB_PASS, database:process.env.DB_DBNAME, port:5432, ssl:{ca:fs.readFileSync("mergedcert.pem").toString()}});
    try {
        await client.connect();
        const a_id = req.query.azure_id;
        const name = req.query.name;
        const m_id = req.query.major_id;
        const curr_sem = req.query.current_semester;
        const result = await client.query(
            `INSERT INTO users (name, major_id, current_semester, azure_id) VALUES ('${name}', '${m_id}', '${curr_sem}', '${a_id}') ON CONFLICT (azure_id) DO UPDATE SET name = EXCLUDED.name, major_id = EXCLUDED.major_id, current_semester = EXCLUDED.current_semester WHERE users.azure_id = EXCLUDED.azure_id;
            SELECT users.name, majors.name, users.current_semester FROM users LEFT JOIN majors ON majors.major_id = users.major_id WHERE azure_id = '${a_id}'`);
        context.res = {
            status: 200,
            body: result.rows[0] || {},
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