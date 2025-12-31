import express from "express";
import dotenv from 'dotenv';
import pkg from "pg";
import cors from "cors";
dotenv.config({path: "./config.env"});
const {Pool} = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.connect()
.then(()=> console.log("Connected to PostgresSQL"))
.catch(err => console.error("DB connection error:", err));

export const app = express();
app.use(express.json());
app.use(cors());