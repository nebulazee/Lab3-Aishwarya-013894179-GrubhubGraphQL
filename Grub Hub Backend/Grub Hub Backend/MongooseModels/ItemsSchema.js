var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var ItemsSchema = new Schema({
    
  
    item_name:{
        type:String
    },
    item_desc:{
        type:String
    },
    item_price:{
        type:Number
    },
    rest_id:{
        type:Number
    },
    item_tag:{
        type:String
    },
    item_image:{
        type:String
    }
});

ItemsSchema.plugin(AutoIncrement, {inc_field: 'item_id'});
module.exports=ItemsSchema