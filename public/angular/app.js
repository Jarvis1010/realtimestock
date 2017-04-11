var app = angular.module('realtimestock',[]);

app.controller('StockController',StockController);

function StockController($scope){
    var socket =io.connect(window.location.href);
    socket.on('add',(data)=>{
        $scope.stocks=data;
        console.log($scope.stocks);
    });
    
    socket.emit('join');
    
    $scope.stocks=[];
    
    $scope.onSubmit=function(){
       var found=$scope.stocks.find((stock)=>{
           return stock==$scope.stockToAdd
       });
       
       if(!found){
        $scope.stocks.push($scope.stockToAdd);
        socket.emit('add',$scope.stocks);
       }
    };
    
}

