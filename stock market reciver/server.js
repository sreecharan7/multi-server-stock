import cluster from "cluster";
import {availableParallelism} from "os";
import process from "node:process";
import server from "./index.js";

const num=availableParallelism();

if(cluster.isPrimary){

    for(let i=0;i<num;i++){
        cluster.fork();
    }

    cluster.on("exit",(Worker,code,signal)=>{
        cluster.fork();
    });
    
}else{
    server.listen(process.env.PORT||3000,()=>{
        console.log("server is started at ",process.env.PORT||3000);
    })    
}