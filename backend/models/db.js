const { Pool } = require("pg");

const pool = new Pool({
  user: "belunee",
  password: "8182Bi++", 
  host: "localhost",
  port: 5432,
  database: "educoli_db",
});

module.exports = pool;