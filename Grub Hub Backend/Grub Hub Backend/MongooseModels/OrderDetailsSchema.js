var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderDetailsSchema = new Schema({
    
    order_id:{
        type:Number
        
    },
    
    item_id:{
        type:Number
    },
    item_name:{
        type:String
    }
    ,
    item_quantity:{
        type:Number
    }
    
});


module.exports=OrderDetailsSchema
















