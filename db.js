const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres Error", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
