module.exports=(sequelize, type)=>{
    return sequelize.define('customer',{
        customer_id:{
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_name:{
            type:type.STRING
        },
        customer_email:{
            type:type.STRING
        },
        customer_password:{
            type:type.STRING
        },
        customer_address:{
            type:type.STRING
        },
        customer_image:{
            type:type.STRING
        }
    })
}