var multer = require('multer')
var path= require('path')
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
        console.log('here');
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
        console.log(file)
        req.filename='/uploads/'+file.fieldname + '-' + req.body.customer_id + file.originalname;
        console.log("new file name"+req.filename);
		callback(null, file.fieldname + '-' + req.body.customer_id + file.originalname);
	}
})
const fileFilter = (req, file, cb) =>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }
    else{
        cb(null,false)
    }
}
var upload=multer({
    storage:storage
})
module.exports=upload;