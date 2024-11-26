const { Client } = require('pg');
const fs = require('fs');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = async function (context, req) {
    var client = new Client({host:"ufcourseplannerdb.postgres.database.azure.com", user:"bytesquad", password:process.env.DB_PASS, database:"ufcourseplanner", port:5432, ssl:{ca:fs.readFileSync("Microsoft RSA Root Certificate Authority 2017.crt")}});
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM users');
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