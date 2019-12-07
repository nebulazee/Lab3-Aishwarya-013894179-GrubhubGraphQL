module.exports=(sequelize, type)=>{
    return sequelize.define('owners',{
        owner_id:{
            type:type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        owner_name:{
            type:type.STRING
        },
        owner_email:{
            type:type.STRING
        },
        owner_password:{
            type:type.STRING
        },
        owner_contactNumber:{
            type:type.INTEGER
        },
        rest_id:{
            type:type.INTEGER
        },
        rest_name:{
            type:type.STRING
        },
        /* rest_zip:{
            type:type.INTEGER
        }, */
        owner_image:{
            type:type.STRING
        }
    })
}