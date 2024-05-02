import { createClient } from "redis";
import dotenv from'dotenv'
dotenv.config();



const redisSubscriber = createClient({
    url: process.env.REDIS
});

redisSubscriber.connect();

export class stockTracker {
    data = {};
    functiondata=()=>{}
    addSubscription(stock) {
        if (!this.data[stock]) {
            this.data[stock] = 1;
            redisSubscriber.subscribe(stock,(message)=>{
                this.handleSubscription(stock,message);
            })
        }
    }
    removeSubscription(stock) {
        if (this.data[stock]) {
            delete this.data[stock];
            redisSubscriber.unsubscribe(stock);
        }
    }
    handleSubscription(stock, message) {
        this.functiondata(stock,message);
    }
    handleFunction(arg){//expects the function
        this.functiondata=arg;
    }   
}