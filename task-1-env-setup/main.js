import express from "express";
import dotenv from 'dotenv';
import pkg from "pg";
const { Client } = pkg;
import cors from "cors";
dotenv.config({path: './config.env' })
// whatever variable we've saved in the config.env will be saved in node js environment
export const app = express();
app.use(express.json());
app.use(cors());

export const db = new Client({
  host: "localhost",
  user: process.env.NODE_USER,
  password: process.env.NODE_PASSWORD,
  database: process.env.NODE_DATABASE,
  port: 5000
});


