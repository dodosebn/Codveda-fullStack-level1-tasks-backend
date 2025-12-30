import express from "express";
import dotenv from 'dotenv';
import pkg from "pg";
const { Client } = pkg;
import cors from "cors";
dotenv.config({path: './config.env' })
export const app = express();
app.use(express.json());
app.use(cors());

export const db = new Client({
  host: process.env.NODE_HOST,
  user: process.env.NODE_USER,
  password: process.env.NODE_PASSWORD,
  database: process.env.NODE_DATABASE,
  port: process.env.NODE_PORT
});


