module.exports=(sequelize, type)=>{
    return sequelize.define('order_details',{
        order_id:{
            type:type.INTEGER,
            
        },
        
        item_id:{
            type:type.INTEGER
        },
        item_name:{
            type:type.STRING
        }
        ,
        item_quantity:{
            type:type.INTEGER
        }
        
    })
}