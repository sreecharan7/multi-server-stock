import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const stockNames=[
    "Apple","Microsoft","Samsung","Google","OpenAI","Lenovo","Dell","Hp","Swiggy","Ola",
    "Uber","Redmi","Zepto","Sandisk","Vivo","Oppo","Rapido","Delloite","TCS","Inofosys"
];

const redisPublisher=new Redis(process.env.REDIS);

function randomNumberArray(){
    const random=Math.floor(Math.random()*(stockNames.length));
    return random;
}

function randomStockchanger(){
    let randomStock=randomNumberArray();
    let randomPrice=Math.floor(Math.random()*1000);
    redisPublisher.publish(stockNames[randomStock],randomPrice);
}

setInterval(()=>{
    randomStockchanger();
},process.env.SPEED);

//different server just sending stock information

import express from "express";
import bodyParser from "body-parser"

const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/all-stocks",(req,res)=>{
    res.send({
        data:stockNames
    });
});

app.get("/enquiry",(req,res)=>{
    if(!req.query.stock){
        res.status(400).send({
            "msg":"stock should provided"
        });
        return;
    }
    if(stockNames.includes(req.query.stock)){
        res.status(200).send({
            "msg":"found"
        });
    }else{
        res.status(400).send({
            "msg":"stock not found"
        });
    }
})

app.get("/enquiry-multiple",(req,res)=>{
    if(!req.body["stock"]||typeof(req.body["stock"])!="object"||!req.body["stock"].length){
        res.status(400).send({status:false,msg:"send some data"});
        return;  
    }
    let data=req.body["stock"];
    let arrs=[];let arrf=[];
    for(let i=0;i<data.length;i++){
        if(stockNames.includes(data[i])){
            arrs.push(data[i]);
        }else{
            arrf.push(data[i]);
        }
    }
    res.send({
        present:arrs,
        notPresent:arrf
    });
})


app.listen(process.env.PORT||5000,()=>{
    console.log("server is started at",process.env.PORT||5000);
});