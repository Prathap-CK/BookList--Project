const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // ❌ NO ssl for local
});

pool.on("connect", () => {
  console.log("Connected to LOCAL PostgreSQL");
});

pool.on("error", (err) => {
  console.error("PostgreSQL error", err);
  process.exit(1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
