module.exports=(sequelize, type)=>{
    return sequelize.define('order_table',{
        order_id:{
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rest_id:{
            type:type.INTEGER
        },
        // item_id:{
        //     type:type.INTEGER
        // },
        order_status:{
            type:type.STRING
        },
        order_cost:{
            type:type.STRING
        },
        // order_quantity:{
        //     type:type.INTEGER
        // },
        customer_id:{
            type:type.INTEGER
        }
    })
}