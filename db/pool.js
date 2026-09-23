const { Pool } = require('pg');
require('dotenv').config();

module.exports = new Pool({
  host: "localhost",
  user: "vmuser",
  database: "mem_only",
  password: "1",
  port: 5432
});

// module.exports = new Pool({
//   connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`
// });