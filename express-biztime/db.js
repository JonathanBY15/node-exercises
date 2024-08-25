/** Database setup for BizTime. */

const { Client } = require('pg');

// Database connection settings
const client = new Client({
//   connectionString: 'postgresql://localhost/biztime',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'walmart48',  // Ensure this is a string
    database: 'biztime'
});

// Connect to the database
client.connect();

module.exports = client;

