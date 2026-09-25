import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// removed:
// database: "mem_only",

const pool = new pg.Pool({
  host: "localhost",
  user: "vmuser",
  database: "mem_only",
  password: "1",
  port: 5432
});

export {pool};

// module.exports = new Pool({
//   connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`
// });