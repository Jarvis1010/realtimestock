var app = angular.module('realtimestock',[]);

app.controller('StockController',StockController);

function StockController($scope,$http){
    var socket =io.connect(window.location.href);
    socket.on('add',(data)=>{
        $scope.stocks=data;
        $scope.$apply();
        getStocks();
    });
    
    socket.emit('join');
    
    $scope.stocks=[];
    $scope.stockData=[];
    
    $scope.onSubmit=function(){
       var found=$scope.stocks.find((stock)=>{
           return stock==$scope.stockToAdd
       });
       
       if(!found){
        $scope.stocks.push($scope.stockToAdd.toUpperCase());
        socket.emit('add',$scope.stocks);
        $scope.stockToAdd='';
       }
    };
    
    $scope.removeStock=function(index){
       $scope.stocks.splice(index,1);
        socket.emit('add',$scope.stocks);
    };
    
    function getStocks(){
        $scope.stocks.forEach((symbol)=>{
            getData(symbol);
        });
    }
    
    function getData(symbol){
        let startDate="2016-11-01";
        let endDate="2017-04-01";
        let url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22"
        +symbol+
        "%22%20and%20startDate%20=%20%22"
        +startDate+
        "%22%20and%20endDate%20=%20%22"
        +endDate+
        "%22&env=store://datatables.org/alltableswithkeys&format=json&callback=";
        console
        $http.get(url).then((results)=>{
            console.log(results.data);
        });
    }
}

