import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  host: "backend_database",
  port: parseInt(process.env.POSTGRES_DB_PORT || "5432"),
  database: process.env.POSTGRES_DB_NAME,
});
