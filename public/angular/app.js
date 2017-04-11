var app = angular.module('realtimestock',[]);

app.controller('StockController',StockController);

function StockController($scope){
    var socket =io.connect(window.location.href);
    socket.on('add',(data)=>{
        $scope.stocks=data;
        $scope.$apply();
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
        $scope.stockToAdd='';
       }
    };
    
    $scope.removeStock=function(index){
       $scope.stocks.splice(index,1);
        socket.emit('add',$scope.stocks);
    };
    
}

