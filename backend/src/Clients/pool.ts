import { Pool } from "pg";
// require('dotenv').config()
import dotenv from "dotenv-defaults";
dotenv.config();

const pool = new Pool({
  max: 20,
  user: process.env?.user,
  host: process.env?.host,
  database: process.env?.databaseName,
  password: process.env?.password,
  port: parseInt(process.env?.dbport), // The default port for PostgreSQL is 5432
});

export {
  pool
};