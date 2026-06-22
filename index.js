import express from "express"
import dotenv from "dotenv"
import db from "./configs/dataBase.js";

const app = express();
const port = 3000;

app.listen(port,(err)=>{
    if(err){
        console.log(error.message);
    }else{
        console.log("server start");
        console.log("http://localhost:",+port);
    }
})