module.exports=(sequelize, type)=>{
    return sequelize.define('items',{
        item_id:{
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        item_name:{
            type:type.STRING
        },
        item_desc:{
            type:type.STRING
        },
        item_price:{
            type:type.INTEGER
        },
        rest_id:{
            type:type.INTEGER
        },
        item_tag:{
            type:type.STRING
        },
        item_image:{
            type:type.STRING
        }
    })
}