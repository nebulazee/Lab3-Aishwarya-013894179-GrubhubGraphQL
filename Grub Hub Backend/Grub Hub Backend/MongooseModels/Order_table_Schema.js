var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var Order_table_Schema = new Schema({
    
    rest_id:{
        type:Number
    },
    // item_id:{
    //     type:type.INTEGER
    // },
    order_status:{
        type:String
    },
    order_cost:{
        type:Number
    },
    // order_quantity:{
    //     type:type.INTEGER
    // },
    customer_id:{
        type:Number
    }
});

Order_table_Schema.plugin(AutoIncrement, {inc_field: 'order_id'});
module.exports=Order_table_Schema