var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var MessagesSchema = new Schema({
    order_id:{
        type:Number
    },
    receiver_id:{
        type:Number
    },
    sender_id:{
        type:Number
    },
    text:{
        type:String
    }
});

MessagesSchema.plugin(AutoIncrement, {inc_field: 'message_id'});
module.exports=MessagesSchema