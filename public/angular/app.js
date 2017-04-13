var app = angular.module('realtimestock',[]);

app.controller('StockController',StockController);

function StockController($scope,$http){
    google.charts.load('current', {'packages':['line']});
    var socket =io.connect(window.location.href);
    socket.on('add',(data)=>{
        $scope.stocks=data;
        $scope.$apply();
        getStocks();
    });
    
    socket.emit('join');
    
    $scope.stocks=[];
    $scope.stockData=[];
    
    $scope.$watchCollection('stockData',drawChart);
    
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
        $scope.stockData=[];
        $scope.stocks.forEach((symbol)=>{
            getData(symbol);
        });
       
    }
    
    function getData(symbol){
       
        let startDate="2016-11-01";
        let endDate="2017-04-01";
        let url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%22"
        +symbol+
        "%22)%20and%20startDate%20=%20%22"
        +startDate+
        "%22%20and%20endDate%20=%20%22"
        +endDate+
        "%22&env=store://datatables.org/alltableswithkeys&format=json&callback=";
        
        $http.get(url).then((results)=>{
            let quotes=results.data.query.results.quote;
            let symbol=quotes[0].Symbol;
            let prices=quotes.map((quote)=>{
                return {date:quote.Date,close:quote.Close};
            });
            $scope.stockData.push({symbol:symbol,prices:prices});
        });
    }
    
    function createDataTable(){
        let dataTable=[];
        
        let row1=['Date'];
        let rows=[];
        for(var i =0;i<$scope.stockData.length;i++){
            var stockData=$scope.stockData[i];
            row1.push(stockData.symbol);
            for(var j=0;j<stockData.prices.length;j++){
                
                var price=stockData.prices[j];
                
                if(i>0){
                    rows[j].push(price.close);
                }else{
                    rows.push([price.date,price.close]);
                }
            }
        }
        
        dataTable.push(row1);
        rows.forEach((row)=>{
            dataTable.push(row);
        });
        console.log(dataTable);
        return dataTable;
    }
    
    function drawChart() {
    
      //console.log(createDataTable());
      var data = google.visualization.arrayToDataTable(createDataTable());

      var options = {
        chart: {
          title: 'Historical Prices',
        },
        width: '80%',
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('chart'));

      chart.draw(data, options);
    }
}

