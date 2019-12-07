var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var RestaurantSchema = new Schema({
    
    rest_name:{
        type:String
    },
    rest_contact:{
        type:Number
    },
    rest_zip:{
        type:Number
    },
    rest_address:{
        type:String
    },
    cuisine:{
        type:String
    },
    rest_image:{
        type:String
    }
});

RestaurantSchema.plugin(AutoIncrement, {inc_field: 'rest_id'});
module.exports=RestaurantSchema


