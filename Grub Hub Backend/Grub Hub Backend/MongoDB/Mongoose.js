var mongoose = require('mongoose');

var CustomerSchema = require('../MongooseModels/CustomerSchema')
var ItemsSchema = require('../MongooseModels/ItemsSchema')
var Order_table_Schema = require('../MongooseModels/Order_table_Schema')
var OrderDetailsSchema = require('../MongooseModels/OrderDetailsSchema')
var OwnerSchema = require('../MongooseModels/OwnerSchema')
var RestaurantSchema = require('../MongooseModels/RestaurantSchema')
var MessagesSchema = require('../MongooseModels/MessagesSchema')

mongoose.connect('mongodb+srv://admin:hanumanji7@cluster0-26gwr.mongodb.net/GRUBHUBDB?retryWrites=true&w=majority',{
useNewUrlParser:true,
poolSize:10
});
var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error', err);
    });
    db.once('open', function () {
    console.log('connected.');
    });


var Customer     = mongoose.model('Customer', CustomerSchema);
var Items        = mongoose.model('Items', ItemsSchema);
var Orders       = mongoose.model('Orders', Order_table_Schema);
var OrderDetails = mongoose.model('OrderDetails', OrderDetailsSchema);
var Owner        = mongoose.model('Owner', OwnerSchema);
var Restaurant   = mongoose.model('Restaurant', RestaurantSchema);
var Messages     = mongoose.model('Messages',MessagesSchema);

module.exports={
    Customer,
    Items,
    Orders,
    OrderDetails,
    Owner,
    Restaurant,
    Messages
}

