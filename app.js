require('./data/db.js');
var express=require('express');
var app=express();
var path = require('path');
var server= require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose=require('mongoose');
var Stock=mongoose.model('Stock');
var request=require('request');


var port = process.env.PORT || 8080;

var stocks=[];

function updateStock(data){
    
    if(data){
        console.log(data);
        
    }else{
        
    }
    
}

io.on('connection',(client)=>{
    console.log('Client connected...');
    
    client.on('join',()=>{
        Stock.findOne({}).exec((err,result)=>{
            stocks=result.stocks;
            client.emit('add',stocks);
        });
        
    });
    
    client.on('add',(data)=>{
        Stock.findOneAndUpdate({},{stocks:data},{upsert:true},(err,result)=>{
            stocks=result.stocks;
            client.broadcast.emit('add',stocks);
            client.emit('add',stocks);
        });
        
    });
});

app.use(express.static(path.join(__dirname,'public')));

server.listen(port,()=>{
    var portNum =server.address().port;
    console.log("server is running on "+portNum);
});