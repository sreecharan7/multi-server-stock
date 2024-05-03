import dotenv from'dotenv'
dotenv.config();
import express from "express";
import http from "http";
import path from "path";
import socket from "./src/socket.js"
import dataFecth from "./src/dataFecth.js";



const app=express();
const server=http.createServer(app);

app.use(express.static("public"));


app.get("/",(req,res,)=>{
    res.sendFile(path.resolve(path.join("public", 'main.html')));
});

app.get("/all-stocks",async (req,res)=>{
   const data= await dataFecth("/all-stocks");
   res.send(
    data.data
   );
});

await socket(server);



export default server;