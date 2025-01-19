import express, { Application, Request, Response } from "express";
import { pool } from "./db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 5000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!" });
  res.sendStatus(200);
});

app.post("/", (req: Request, res: Response) => {
  const { name, school } = req.body;
  res.status(200).send({ message: `Your KEYS were ${name}, ${school}` });
});

app.post("/createNewUser", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      school,
      academic_standing,
      expected_grad_date,
    } = req.body;
    await pool.query(
      `INSERT INTO students
      (first_name, last_name, email, school, academic_standing, expected_grad_date)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        first_name,
        last_name,
        email,
        school,
        academic_standing,
        expected_grad_date,
      ]
    );
    res.status(200).send("User Inserted!");
  } catch (err: unknown) {
    console.log(`Detailed error: ${err}`);
    if (err instanceof Error) {
      res.status(500).send(`Error in user creation ${err.message}`);
    } else {
      res.status(500).send("An unknown error occurred during user creation");
    }
  }
});

// Mock setup route
app.get("/setupUserTable", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connection successful");

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_level') THEN
          CREATE TYPE grade_level AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR');
        END IF;
      END $$;
    `);
    console.log("Enum type created or verified");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY, 
        first_name varchar(255) NOT NULL,
        last_name varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE,
        school varchar(255) NOT NULL, 
        academic_standing grade_level,
        expected_grad_date date,
        is_deleted boolean NOT NULL DEFAULT false,
        deleted_at timestamp,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table created or verified");

    res.status(200).send("Table setup completed");
  } catch (err: unknown) {
    console.error("Detailed error:", err);
    if (err instanceof Error) {
      res.status(500).send(`Error in table setup: ${err.message}`);
    } else {
      res.status(500).send("An unknown error occurred during table setup");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
