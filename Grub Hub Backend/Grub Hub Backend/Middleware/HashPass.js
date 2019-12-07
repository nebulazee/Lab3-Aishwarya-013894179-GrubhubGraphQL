const bcrypt = require('bcrypt');
const saltRounds = 10;

var hashPass = (password)=>{
    return bcrypt.hash(password,saltRounds,function(err,hash){
        return hash;
    })
}
module.exports=hashPass;