import express from "express";
const app = express();

import path from "node:path";
import fs from "node:fs";

import dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { createServer } from "node:http";
import conn from "../database/conn.js";
import router from "../routes/v1/index.js";

const serverHTTP = createServer(app);

const pathLog = path.join("src", "logs", "access.log");
const createFileLog = fs.createWriteStream(pathLog, { flags: "a" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: createFileLog,
  })
);
app.disable("x-powered-by");

app.use("/api/v1", (req, _, next) => {
  console.log(`Path: ${req.path} | Method: ${req.method}`);
  next();
});
app.use("/api/v1", router);

const port = process.env.PORT;

serverHTTP.listen(port, () => {
  console.log(`Servidor User rodando na porta ${port}`);
  conn();
});
