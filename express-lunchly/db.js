/** Database for lunchly */

const pg = require("pg");

const db = new pg.Client({
    connectionString: "postgresql://postgres:walmart48@localhost/lunchly"
  });

db.connect();

module.exports = db;
