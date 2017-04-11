var mongoose=require('mongoose');

var stockScheme=new mongoose.Schema(
    {
        stocks:[{type: String}]
    }
);

mongoose.model("Stock",stockScheme,'stocks');