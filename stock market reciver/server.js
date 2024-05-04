import cluster from "cluster";
import {availableParallelism} from "os";
import process from "node:process";
import dotenv from'dotenv'
dotenv.config();
import express from "express";
import http from "http";
import path from "path";
import socket from "./src/socket.js"
import dataFecth from "./src/dataFecth.js";

const num=availableParallelism();

if(cluster.isPrimary){

    for(let i=0;i<num;i++){
        cluster.fork();
    }

    cluster.on("exit",(Worker,code,signal)=>{
        cluster.fork();
    });
    
}else{
    
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
    server.listen(process.env.PORT||3000,()=>{
        console.log("server is started at ",process.env.PORT||3000,process.pid);
    }) 
}
