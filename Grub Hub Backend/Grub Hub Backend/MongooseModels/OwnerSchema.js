var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var OwnerSchema = new Schema({
    
    owner_name:{
        type:String
    },
    owner_email:{
        type:String
    },
    owner_password:{
        type:String
    },
    owner_contactNumber:{
        type:Number
    },
    rest_id:{
        type:Number
    },
    rest_name:{
        type:String
    },
    /* rest_zip:{
        type:type.INTEGER
    }, */
    owner_image:{
        type:String
    }
});

OwnerSchema.plugin(AutoIncrement, {inc_field: 'owner_id'});
module.exports=OwnerSchema


























