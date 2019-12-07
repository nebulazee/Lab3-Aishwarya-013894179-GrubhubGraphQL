const { Customer, Owner, Order, Restaurant, Items } = require('../Sequelize/Sequelize')
var express = require('express')
var pool = require('../DBConfig/MySQLconfig')
var router = express.Router();
var mysql = require('mysql')
var cacheIt = require('../Cache/Cache')
var sessionStorage = require('sessionstorage')
var middleware = require('../Middleware/middleware')
var upload = require('../Middleware/FileUploadMiddleware')
const bcrypt=require('bcrypt')
var salt=bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');

router.post('/addCustomer', (req, res) => {

   

    console.log(req.body)
    const { name, email, password, address } = req.body;
    console.log('hashed'+bcrypt.hashSync(password,salt))
    const cust = {
        customer_name: name,
        customer_email: email,
        customer_password: bcrypt.hashSync(password,salt),
        customer_address: address
    }
    Customer.create(cust)
        .then(user => res.json({
            errMsg: '',
            success: true,
            user: user
        }))
        .catch((e) => {
            res.json({
                errMsg: 'cannot add customer',
                success: false,
                user: ''
            })
        })

})
router.post('/updateCustomer',(req,res)=>{
    const {customer_id,customer_name,customer_email,customer_address}=req.body;
    Customer.update({
        customer_name: customer_name,
        customer_email: customer_email,
        customer_address: customer_address
      }, {
        where: {
          
          customer_id:customer_id
        }
      }).then(result=>{
        Customer.findAll({
            where: {
                customer_name: customer_name,
                customer_id: customer_id
            }
        }).then((cust) => {
            res.json({ update: result, errMsg: "no error", cust: cust });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot add pic',cust:''})})
        })
})
router.post('/addCustomerPhoto',upload.single('customer_image'),(req,res)=>{
    console.log("new method"+req.file)
    console.log("new filename 2"+req.filename);
    console.log(req.body)
    console.log(req.body.customer_name)
    console.log(req.file.path)
     Customer.update({
        customer_image: req.filename,
      }, {
        where: {
          customer_name:req.body.customer_name,
          customer_id:req.body.customer_id
        }
      }).then(result=>{
        Customer.findAll({
            where: {
                customer_name: req.body.customer_name,
                customer_id: req.body.customer_id
            }
        }).then((cust) => {
            res.json({ update: result, errMsg: "no error", cust: cust });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot add pic',cust:''})})
        })
         

    //res.json({path:req.file.path})
})
/* router.post('/addCustomerPic',(req,res)=>{

}) */
router.post('/addRestaurantPhoto',upload.single('rest_image'),(req,res)=>{
    console.log("new method"+req.file)
    console.log("new filename 2"+req.filename);
    console.log(req.body)
    //console.log(req.body.customer_name)
    console.log(req.file.path)
     Restaurant.update({
        rest_image: req.filename,
      }, {
        where: {
          rest_name:req.body.rest_name,
          rest_id:req.body.rest_id
        }
      }).then(result=>{
        Restaurant.findAll({
            where: {
                rest_name: req.body.rest_name,
                rest_id: req.body.rest_id
            }
        }).then((rest) => {
            res.json({ update: result, errMsg: "no error", rest: rest });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot add pic',rest:''})})
        })
         
})
router.post('/addOwner', (req, res) => {

    console.log(req.body)
    const { name, email, password, contactNumber, rest_name, zip, rest_address, cuisine, rest_contact } = req.body;
    const rest={
        rest_name:rest_name,
        rest_contact:rest_contact,
        rest_zip:zip,
        rest_address:rest_address,
        cuisine:cuisine
    }
    Restaurant.create(rest).then(rest=>{
        const own = {
            owner_name: name,
            owner_email: email,
            owner_password: bcrypt.hashSync(password,salt),
            owner_contactNumber: contactNumber,
            rest_id: rest.rest_id,
            rest_name: rest.rest_name
        }
        Owner.create(own)
        .then(user =>{
            
            res.json({ errMsg: '', success: true, user: user })
    })
        .catch((e) => {
            console.log(e);
            res.json({ errMsg: 'cannot add owner'+e.message, success: false, user: '' })
        })
    })
    
    
    

})
router.post('/addOwnerPhoto',upload.single('owner_image'),(req,res)=>{
    //console.log(req.filename);
    console.log("new method"+req.file)
    console.log("new filename 2"+req.filename);
    console.log(req.body)
    console.log(req.body.customer_name)
    console.log(req.file.path)
     Owner.update({
        owner_image: req.filename,
      }, {
        where: {
          owner_name:req.body.owner_name,
          owner_id:req.body.owner_id
        }
      }).then(result=>{
        Owner.findAll({
            where: {
                owner_name: req.body.owner_name,
                owner_id: req.body.owner_id
            }
        }).then((own) => {
            res.json({ update: result, errMsg: own.owner_image, own: own });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot add pic'+e.message,own:''})})
        })
         

    //res.json({path:req.file.path})
})

router.post('/updateOwner',(req,res)=>{
    const {owner_id,owner_name,owner_email,owner_contactNumber}=req.body;
    Owner.update({
        owner_name: owner_name,
        owner_email: owner_email,
        owner_contactNumber:owner_contactNumber
      }, {
        where: {
          
            owner_id:owner_id
        }
      }).then(result=>{
        Owner.findAll({
            where: {
                owner_name: owner_name,
                owner_id: owner_id
            }
        }).then((own) => {
            res.json({ update: result, errMsg: "no error", own: own[0] });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot add pic',own:''})})
        })
})

router.post('/addOrder', (req, res) => {

    console.log(req.body)
    const { rest_id, item_id, order_status, order_quantity, customer_id } = req.body;
    const order = {
        rest_id: rest_id,
        item_id: item_id,
        order_status: order_status,
        order_quantity: order_quantity,
        customer_id: customer_id,
    }
    Order.create(order)
        .then(user => res.json(user))
        .catch((e) => { res.json({ errMsg: 'cannot add order' }) })

})
router.post('/customerSignIn', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    //var salt=bcrypt.genSaltSync(10);
    //console.log('hashed'+bcrypt.hashSync(password,salt))
    console.log()
    Customer.findAll({
        where: {
            customer_email: email,
           // customer_password: bcrypt.hashSync(password,salt).toString()
        }
    }).then((cust) => {

        if(bcrypt.compareSync(password,cust[0].customer_password)){
        res.cookie('token', 'token', { httpOnly: false });
        //req.session.user=cust;
        //console.log(req.session.user)
        console.log(cust)
        /* res.writeHead(200,{
            'Content-Type':'application/json'
        }) */
        res.json({ authentication: true, errMsg: '', cust: cust });
    }
    else{
        res.json({authentication: false,errMsg: 'Invalid User',cust:null})
    }
    }).catch((e) => { res.json({ authentication: false, errMsg: 'SignIn Unsuccessful-'+e.message, cust: '' }) });
})
router.post('/ownerSignIn', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    Owner.findAll({
        where: {
            owner_email: email,
            //owner_password: password
        }
    }).then((own) => {
       
        owner=own[0];
        let passwordHash=owner.owner_password;
        if(!bcrypt.compareSync(password,passwordHash))
             res.json({ authentication: false, errMsg: 'Invalid password', own: null });
        let own_rest_id=owner.owner_id;
        Restaurant.findAll({
            where:{
                rest_id:own_rest_id
            }
        }).then((rests)=>{
            console.log(rests)
            restaurant=rests[0];
            const respOwner={
                owner_id:owner.owner_id,
                owner_name:owner.owner_name,
                owner_email:owner.owner_email,
                owner_contactNumber:owner.owner_contactNumber,
                rest_id:restaurant.rest_id,
                rest_name:restaurant.rest_name,
                owner_image:owner.owner_image,
                rest_address:restaurant.rest_address,
                rest_zip:restaurant.rest_zip,
                rest_image:restaurant.rest_image,
                rest_contact:restaurant.rest_contact,
                cuisine:restaurant.cuisine

            }
           /*  owner.rest_name=restaurant.rest_name;
            owner.rest_address=restaurant.rest_address;
            owner.rest_contact=restaurant.rest_contact;
            owner.rest_zip=restaurant.rest_zip;
            owner.rest_image=restaurant.rest_image; */
            res.cookie('token', 'token', { httpOnly: false });
            req.session.user=own;
            res.json({ authentication: true, errMsg: '', own: respOwner });
        })
        
   /*      
        res.cookie('token', 'token', { httpOnly: false });
        req.session.user=own;
      
        res.json({ authentication: true, errMsg: '', own: own }); */
    }).catch((e) => { res.json({ authentication: false, errMsg: 'SignIn Unsuccessful', own: '' }) });
})

router.post('/RestPhoto',upload.single('rest_image'),(req,res)=>{
    //console.log(req.filename);
    console.log(req.body)
    console.log(req.file.path)
     Restaurant.update({
        rest_image: req.file.path,
      }, {
        where: {
          rest_name:req.body.rest_name,
          rest_id:req.body.rest_id
        }
      }).then(result=>{
        Restaurant.findAll({
            where: {
                rest_name: req.body.rest_name,
                rest_id: req.body.rest_id
            }
        }).then((rest) => {
            res.json({ update: result, errMsg: "no error", rest: rest });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot add pic',rest:''})})
        })
         

    //res.json({path:req.file.path})
})
router.post('/updateRestaurant',(req,res)=>{
    const {rest_id,rest_name,rest_contact,rest_address,rest_zip,cuisine}=req.body;
    Restaurant.update({
        rest_name: rest_name,
        rest_contact: rest_contact,
        rest_address: rest_address,
        rest_zip:rest_zip,
        cuisine:cuisine
      }, {
        where: {
          
            rest_id:rest_id
        }
      }).then(result=>{
        Restaurant.findAll({
            where: {
                rest_name: rest_name,
                rest_id: rest_id
            }
        }).then((rest) => {
            res.json({ update: result, errMsg: "no error", rest: rest });
        })
        .catch(e=>{res.json({update: '',errMsg: 'Cannot updtae rest'+e.message,rest:''})})
        })
})
router.get('/getCustomerById',(req,res)=>{
    console.log(req.query.customer_id);
    Customer.findAll({
        where:{
            customer_id:req.query.customer_id
        }
    }).then(customers=>{
        res.json({success:true,errMsg:"",customer:customers[0]})
    })
})
router.get('/getRestByRestId',(req,res)=>{
    console.log(req.query.rest_id);
    Restaurant.findAll({
        where:{
            rest_id:req.query.rest_id
        }
    })
    .then(rests=>{
        res.json({
            success:true,
            errMsg:"",
            rests:rests[0]
        })
    })
})
module.exports = router;