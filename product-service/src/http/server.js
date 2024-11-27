import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";

const serverHTTP = createServer(app);

const port = process.env.PORT;

serverHTTP.listen(port, () => {
  console.log(`Servidor Product rodando na porta ${port}`);
});
