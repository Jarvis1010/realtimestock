var app = angular.module('realtimestock',[]);

app.controller('StockController',StockController);

function StockController($scope){
    var socket =io.connect(window.location.href);
    socket.on('messages',(data)=>{
        $scope.stocks.push(data);
        console.log($scope.stocks);
    });

    $scope.stocks=[];
    
    $scope.onSubmit=function(){
        
        socket.emit('messages',$scope.stockToAdd);
    };
}

