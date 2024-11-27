import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const conn = async () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: process.env.MONGO_NAME,
    })
    .then(() => {
      console.log(`Banco de dados sincronizado`);
    })
    .catch((error) => {
      console.log(
        `Não foi possível sicronizar com o bando de dados. Error: ${error.message}`
      );
    });
};

export default conn;
