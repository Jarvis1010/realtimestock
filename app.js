var express=require('express');
var app=express();
var path = require('path');
var server= require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8080;

io.on('connection',(client)=>{
    console.log('Client connected...');
    
    client.on('messages',(data)=>{
        client.broadcast.emit('messages',data);
        client.emit('messages',data);
    });
});

app.use(express.static(path.join(__dirname,'public')));

server.listen(port,()=>{
    var portNum =server.address().port;
    console.log("server is running on "+portNum);
});