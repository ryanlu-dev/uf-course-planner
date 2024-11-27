const { Client } = require('pg');
const fs = require('fs');

module.exports = async function (context, req) {
    var client = new Client({host:"ufcourseplannerdb.postgres.database.azure.com", user:"bytesquad", password:process.env.DB_PASS, database:"ufcourseplanner", port:5432, ssl:{ca:fs.readFileSync("mergedcert.pem").toString()}});
    try {
        await client.connect();
        const a_id = req.query.azure_id;
        const result = await client.query(`SELECT users.name AS user_name, majors.name AS major_name, colleges.name AS college_name, users.current_semester FROM users LEFT JOIN majors ON users.major_id = majors.major_id LEFT JOIN colleges ON majors.college_id = colleges.college_id WHERE users.azure_id = '${a_id}'`);
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