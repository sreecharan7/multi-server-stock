import { Server } from "socket.io";
import dataFecth from "./dataFecth.js";
import {stockTracker} from "./stock.js";

export default async function (server){
    let stock=new stockTracker();
    let stocksTrackerNum={};
    
    const io=new Server(server,{
        path:'/live-stock'
    });

    io.on("connection",async(socket)=>{
        socket.on("addStock",async(arg,callback)=>{
            if(!arg||typeof(arg)!="string"){
                callback(JSON.stringify({status:false,msg:"please, provide valid data"}));
            }
            const fenchedData=await dataFecth("/enquiry?stock="+arg);
            if(!fenchedData){
                callback(JSON.stringify({status:false,msg:"Stock not found"}));
                return;
            }
            socket.join("stock-"+arg);
            stock.addSubscription(arg);
            updateMembers(arg,1);
            callback(JSON.stringify({status:true,msg:"added to the room"}));
        });
        socket.on("addStockMultiple",async(arg,callback)=>{
            arg=JSON.parse(arg);
            if(!arg||typeof(arg)!="object"||!arg.length){
                callback(JSON.stringify({status:false,msg:"please, provide valid data"}));
            }
            let fenchedData=await dataFecth("/enquiry-multiple",{stock:arg});
            if(!fenchedData){
                callback(JSON.stringify({status:false,msg:"Stock not found"}));
                return;
            }
            fenchedData=fenchedData["data"];
            for(let i=0;i<fenchedData.present.length;i++){
                socket.join("stock-"+fenchedData.present[i]);
                stock.addSubscription(fenchedData.present[i]);
                updateMembers(fenchedData.present[i],1);
            }
            callback(JSON.stringify({status:true,msg:"added to the room",
            sucess:fenchedData.present,failure:fenchedData.notPresent}));
        });

        socket.on("removeStock",(arg,callback)=>{
            arg=JSON.parse(arg);
            for(let i=0;i<arg.length;i++){
                socket.leave(arg[i]);
                updateMembers(arg[i],-1);
            }
            callback(JSON.stringify({status:true,msg:"left the stock"}));
        });
        socket.on('disconnecting', () => {
            const rooms = Array.from(socket.rooms);
            rooms.slice(1).forEach((a) => {
                updateMembers(a.split("-")[1], -1);
            });
        });
    });
    stock.handleFunction((stock,price)=>{
        io.to("stock-"+stock).emit("stock-price",JSON.stringify({
            stock:stock,
            price:price
        }));
    });
    function updateMembers(stocks,num){
        stocksTrackerNum[stocks]=stocksTrackerNum[stocks]||0;
        stocksTrackerNum[stocks]+=num;
        if(stocksTrackerNum[stocks]<=0){
            let num=io.sockets.adapter.rooms[`stock-${stock}`];
            if(num==0){
                stock.removeSubscription(stocks);
            }
            stocksTrackerNum[stocks]=num;
        };
    }
}