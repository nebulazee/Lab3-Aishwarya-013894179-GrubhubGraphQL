module.exports=(sequelize, type)=>{
    return sequelize.define('restaurant',{
        rest_id:{
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rest_name:{
            type:type.STRING
        },
        rest_contact:{
            type:type.INTEGER
        },
        rest_zip:{
            type:type.INTEGER
        },
        rest_address:{
            type:type.STRING
        },
        cuisine:{
            type:type.STRING
        },
        rest_image:{
            type:type.STRING
        }
    })
}