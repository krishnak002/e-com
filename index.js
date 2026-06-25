import express from "express";
import dotenv from "dotenv";
import db from "./configs/dataBase.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

db();

app.listen(port, () => {
    console.log(`Server start on http://localhost:${port}`);
});