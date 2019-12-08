var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var SectionSchema = new Schema({
    
    sectionName:{
        type:String
    },
    rest_id:{
        type:Number
    }
   
});

SectionSchema.plugin(AutoIncrement, {inc_field: 'section_id'});
module.exports=SectionSchema


