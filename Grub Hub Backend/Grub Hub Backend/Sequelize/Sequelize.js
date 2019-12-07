const Sequelize = require('sequelize');

const CustomerModel = require('../Models/Customer')
const OrderModule = require('../Models/Order_table')
const OwnerModule = require('../Models/Owner')
const RestaurantModule = require('../Models/Restaurant')
const ItemsModule = require('../Models/Items')
const OrderDetailsModule =require('../Models/OrderDetails')

const sequelize = new Sequelize('GRUBHUB_DB','grubhub_owner','hanumanji7',{
    host: 'localhost',
    port: 3306,
    dialect:'mysql',
    pool: {
        max:1,
        min:0,
        acquire: 30000,
        idle: 10000
    }
})

const Customer = CustomerModel(sequelize,Sequelize);
const Owner = OwnerModule(sequelize,Sequelize);
const Order = OrderModule(sequelize,Sequelize);
const Restaurant = RestaurantModule(sequelize,Sequelize);
const Items = ItemsModule(sequelize,Sequelize);

const OrderDetails = OrderDetailsModule(sequelize,Sequelize);

sequelize.sync({force:false}).then(()=>{
    console.log('Database and tables created')
})

module.exports = {
    Customer,
    Owner,
    Order,
    Restaurant,
    Items,
    OrderDetails
}