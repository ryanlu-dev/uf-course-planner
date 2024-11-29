const { Client } = require('pg');
const fs = require('fs');

module.exports = async function (context, req) {
    var client = new Client({host:process.env.DB_HOSTNAME, user:process.env.DB_USER, password:process.env.DB_PASS, database:process.env.DB_DBNAME, port:5432, ssl:{ca:fs.readFileSync("mergedcert.pem").toString()}});
    try {
        await client.connect();
        const a_id = req.query.azure_id;
        const result = await client.query(`SELECT majors.name AS major_name, users.current_semester, model_semester_plans.html FROM users LEFT JOIN majors ON users.major_id = majors.major_id LEFT JOIN model_semester_plans ON majors.major_id = model_semester_plans.major_id WHERE users.azure_id = '${a_id}'`);
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