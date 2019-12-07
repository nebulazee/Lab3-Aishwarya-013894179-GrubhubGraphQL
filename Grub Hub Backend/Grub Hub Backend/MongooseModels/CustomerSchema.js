var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var CustomerSchema = new Schema({
   
    customer_name:{
        type:String
    },
    customer_email:{
        type:String
    },
    customer_password:{
        type:String
    },
    customer_address:{
        type:String
    },
    customer_image:{
        type:String
    }
});

CustomerSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});
module.exports=CustomerSchema