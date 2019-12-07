const { Customer, Items, Orders, OrderDetails, Owner, Restaurant } = require('../MongoDB/Mongoose')
var passport = require('passport')
var express = require('express')
var jwt = require('jsonwebtoken');
var router = express.Router();
var mysql = require('mysql')
var cacheIt = require('../Cache/Cache')
var sessionStorage = require('sessionstorage')
var middleware = require('../Middleware/middleware')
var upload = require('../Middleware/FileUploadMiddleware')
const bcrypt = require('bcrypt')
var salt = bcrypt.genSaltSync(10);
//require('../config/passport')(passport);
//var kafka = require('../KafkaClient/KafkaClient')
router.post('/addCustomer',async (req, res) => {

    console.log(req.body)
    const { name, email, password, address } = req.body;
    console.log('hashed' + bcrypt.hashSync(password, salt))

    const cust = new Customer({
        customer_name: name,
        customer_email: email,
        customer_password: bcrypt.hashSync(password, salt),
        customer_address: address
    });
    await cust.save(function (err, data) {
        if (err) {
            console.log(err);
            res.json({
                errMsg: 'cannot add customer',
                success: false,
                user: ''
            })
        }
        else {
            res.json({
                errMsg: '',
                success: true,
                user: data
            })
        }
    })
})
//using kafka
/* router.post('/addCustomer', (req, res) => {

    console.log(req.body)
    const req_packet={
        end_pt:'/addCustomer',
        body:req.body
    }
     kafka.make_request('custTopic',req_packet, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                errMsg: 'cannot add customer',
                success: false,
                user: ''
            })
        }else{
            console.log("Inside else");
               
                res.json({
                    success: true,
                    errMsg: '',
                    user:results
                });

                res.end();
            }
        
    });
    
}) */
//using kafka
/* router.post('/updateCustomer', passport.authenticate('jwt', { session: false }),  (req, res) => {
    const { customer_id, customer_name, customer_email, customer_address } = req.body;
    const req_packet={
        end_pt:'/updateCustomer',
        body:req.body
    }
    kafka.make_request('custTopic',req_packet, function(err,result){
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({ update: '', errMsg: 'Cannot update customer right now', cust: '' })
        }else{
            console.log("Inside else");
               
            res.json({ update: result, errMsg: "no error", cust: result });

                res.end();
            }
        
    });



}) */
 router.post('/updateCustomer', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { customer_id, customer_name, customer_email, customer_address } = req.body;

    await Customer.update({
        customer_id: customer_id
    },
        {
            customer_name: customer_name,
            customer_email: customer_email,
            customer_address: customer_address
        }, {}, (err, result) => {
            if (err) {
                res.json({ update: '', errMsg: 'Cannot update customer right now', cust: '' })
            }
            else {
                res.json({ update: result, errMsg: "no error", cust: result });

            }
        })



}) 
//using kafka
/* router.post('/addCustomerPhoto',passport.authenticate('jwt', { session: false }), upload.single('customer_image'), (req, res) => {
    console.log("new method" + req.file)
    console.log("new filename 2" + req.filename);
    console.log(req.body)
    console.log(req.body.customer_name)
    console.log(req.file.path)
    const req_packet={
        end_pt:'/addCustomerPhoto',
        body:{
            body:req.body,
            image:req.filename
        }
    }
    kafka.make_request('custTopic',req_packet, function(err,result){
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({ update: '', errMsg: 'Cannot add pic', cust: '' })
        }else{
            console.log("Inside else");
               
            res.json({ success: true, errMsg: "no error", cust: result });

                res.end();
            }
        
    });
   
}) */
router.post('/addCustomerPhoto',passport.authenticate('jwt', { session: false }), upload.single('customer_image'), (req, res) => {
    console.log("new method" + req.file)
    console.log("new filename 2" + req.filename);
    console.log(req.body)
    console.log(req.body.customer_name)
    console.log(req.file.path)

    Customer.update({
        customer_name: req.body.customer_name,
        customer_id: req.body.customer_id
    },
        {
            customer_image: req.filename
        }, {}, async (err, result) => {
            await Customer.find({
                customer_name: req.body.customer_name,
                customer_id: req.body.customer_id
            }, (err, cust) => {
                if (err) {
                    res.json({ update: '', errMsg: 'Cannot add pic', cust: '' })
                }
                res.json({ update: result, errMsg: "no error", cust: cust })
            })

        })
})
//have to check after add restarant and add owner
router.post('/addRestaurantPhoto',passport.authenticate('jwt', { session: false }), upload.single('rest_image'), async (req, res) => {
    console.log("new method" + req.file)
    console.log("new filename 2" + req.filename);
    console.log(req.body)
    //console.log(req.body.customer_name)
    console.log(req.file.path)
    await Restaurant.update({
        rest_name: req.body.rest_name,
        rest_id: req.body.rest_id
    },
        {
            rest_image: req.filename,
        }, {}, async (err, result) => {
            await Restaurant.find({

                rest_name: req.body.rest_name,
                rest_id: req.body.rest_id

            }, (err, rest) => {
                if (err) {
                    res.json({ update: '', errMsg: 'Cannot add pic', rest: '' })
                }
                res.json({ update: result, errMsg: "no error", rest: rest });
            })

        })
})
//using kafka
/* router.post('/addOwner',(req, res) => {

    const req_packet = {
        end_pt: '/addOwner',
        body: req.body
    }
   kafka.make_request('ownTopic',req_packet,function(err,result){
       if(err)
        res.json({ errMsg: 'cannot add owner'+e.message, success: false, user: '' })
        res.json({ errMsg: '', success: true, user: result })  
   })
}) */
router.post('/addOwner',(req, res) => {

    console.log(req.body)
    const { name, email, password, contactNumber, rest_name, zip, rest_address, cuisine, rest_contact } = req.body;
    const rest= new Restaurant({
        rest_name:rest_name,
        rest_contact:rest_contact,
        rest_zip:zip,
        rest_address:rest_address,
        cuisine:cuisine
    })
    rest.save((err,rest)=>{
        const own = new Owner({
            owner_name: name,
            owner_email: email,
            owner_password: bcrypt.hashSync(password,salt),
            owner_contactNumber: contactNumber,
            rest_id: rest.rest_id,
            rest_name: rest.rest_name
        })
        own.save((err,user)=>{
            if(err)
            res.json({ errMsg: 'cannot add owner'+e.message, success: false, user: '' })
            else
            res.json({ errMsg: '', success: true, user: user })
        })
        
    })
})
//using kafka
/* router.post('/addOwnerPhoto',passport.authenticate('jwt', { session: false }),upload.single('owner_image'),(req,res)=>{
    //console.log(req.filename);
    console.log("new method"+req.file)
    console.log("new filename 2"+req.filename);
    console.log(req.body)
    console.log(req.body.customer_name)
    console.log(req.file.path)
    const req_packet = {
        end_pt: '/addOwnerPhoto',
        body: {
            body:req.body,
            image:req.filename
        }
    }
     kafka.make_request('ownTopic', req_packet, function(err,result){
         if(err)
            res.json({update: '',errMsg: 'Cannot add pic'+e.message,own:''});
        res.json({ update: result, errMsg: '', own: result });
     })
}) */
router.post('/addOwnerPhoto',passport.authenticate('jwt', { session: false }),upload.single('owner_image'),(req,res)=>{
    //console.log(req.filename);
    console.log("new method"+req.file)
    console.log("new filename 2"+req.filename);
    console.log(req.body)
    console.log(req.body.customer_name)
    console.log(req.file.path)
     Owner.update({

          owner_name:req.body.owner_name,
          owner_id:req.body.owner_id
    
      },{
        owner_image: req.filename,
      },{},(err,result)=>{
        Owner.find({
                owner_name: req.body.owner_name,
                owner_id: req.body.owner_id
        },(err,own) => {
            if(err){
                res.json({update: '',errMsg: 'Cannot add pic'+e.message,own:''});
            }
            res.json({ update: result, errMsg: '', own: own });
        })
        
      })
})
//using kafka
/* router.post('/updateOwner',passport.authenticate('jwt', { session: false }),(req,res)=>{
    const req_packet = {
        end_pt: '/updateOwner',
        body: req.body
    }
    kafka.make_request('ownTopic',req_packet,function(err,results){
        if(err)
            res.json({update: '',errMsg: 'Cannot add pic',own:''}); 
        res.json({ update: results[0], errMsg: "no error", own: results[0] });
    })
}) */
router.post('/updateOwner',passport.authenticate('jwt', { session: false }),(req,res)=>{
    const {owner_id,owner_name,owner_email,owner_contactNumber}=req.body;
    Owner.update( {
            owner_id:owner_id
        },{
                owner_name: owner_name,
                owner_email: owner_email,
                owner_contactNumber:owner_contactNumber
        },{},
        (err,result)=>{
            Owner.find({
                owner_name: owner_name,
                owner_id: owner_id
            },(err,own)=>{
                if(err){
                    res.json({update: '',errMsg: 'Cannot add pic',own:''});
                }
                res.json({ update: result, errMsg: "no error", own: own[0] });
            })
        }
      )
})
//no longer used method
router.post('/addOrder',passport.authenticate('jwt', { session: false }), (req, res) => {

    console.log(req.body)
    const { rest_id, item_id, order_status, order_quantity, customer_id } = req.body;
    const order = new Order({
        rest_id: rest_id,
        item_id: item_id,
        order_status: order_status,
        order_quantity: order_quantity,
        customer_id: customer_id,
    })
    order.save((err,order)=>{
        if(err)
        {
            res.json(user)
        }
        else{
            res.json({ errMsg: 'cannot add order' })
        }
    })
        
})

router.post('/customerSignIn', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    //var salt=bcrypt.genSaltSync(10);
    //console.log('hashed'+bcrypt.hashSync(password,salt))
    console.log()
    Customer.find({
        
            customer_email: email,
           // customer_password: bcrypt.hashSync(password,salt).toString()
        
    },(err,cust) => {

        if(bcrypt.compareSync(password,cust[0].customer_password)){
            console.log("matched")
            var token = jwt.sign(cust[0].toJSON(), "aishwaryaisagoodboy", {
                expiresIn: 10080 // in seconds
              });
        res.cookie('token', 'Bearer '+ token, { httpOnly: false });
      
        console.log(cust)
     
        res.json({ authentication: true, errMsg: '', cust: cust });
    }
})
})
//customer sign in using kafka
/* router.post('/customerSignIn', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    kafka.make_request('cust_signin',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.cookie('token', 'Bearer '+ results.token, { httpOnly: false });
                res.json({
                    authentication: true,
                    errMsg: '',
                    cust:results.cust
                });

                res.end();
            }
        
    });
   
}) */
//using kafka
/* router.post('/ownerSignIn', (req, res) => {
    console.log(req.body);
    kafka.make_request('own_signin',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.cookie('token', 'Bearer '+ results.token, { httpOnly: false });
                res.json({
                    authentication: true, 
                    errMsg: '',
                    own:results.own
                });

                res.end();
            }
        
    });
    
}) */
router.post('/ownerSignIn', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    Owner.find({
        
            owner_email: email,
            //owner_password: password
        
    },(err,own) => {
       
        owner=own[0];
        let passwordHash=owner.owner_password;
        if(!bcrypt.compareSync(password,passwordHash))
             res.json({ authentication: false, errMsg: 'Invalid password', own: null });
        let own_rest_id=owner.rest_id;
        Restaurant.find({
            
                rest_id:own_rest_id
            
        },(err,rests)=>{
            if(err)
            res.json({ authentication: false, errMsg: 'SignIn Unsuccessful', own: '' });
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
            owner.rest_name=restaurant.rest_name;
            owner.rest_address=restaurant.rest_address;
            owner.rest_contact=restaurant.rest_contact;
            owner.rest_zip=restaurant.rest_zip;
            owner.rest_image=restaurant.rest_image; //here end comment
            var token = jwt.sign(owner.toJSON(), "aishwaryaisagoodboy", {
                expiresIn: 10080 // in seconds
              });
            res.cookie('token', 'Bearer '+token, { httpOnly: false });
            req.session.user=own;
            res.json({ authentication: true, errMsg: '', own: respOwner });
        })
        
   /*      
        res.cookie('token', 'token', { httpOnly: false });
        req.session.user=own;
      
        res.json({ authentication: true, errMsg: '', own: own });*/ //here end comment
    })
})


router.post('/updateRestaurant',passport.authenticate('jwt', { session: false }),(req,res)=>{
    const {rest_id,rest_name,rest_contact,rest_address,rest_zip,cuisine}=req.body;
    Restaurant.update( {
            rest_id:rest_id
        },
        {
            rest_name: rest_name,
            rest_contact: rest_contact,
            rest_address: rest_address,
            rest_zip:rest_zip,
            cuisine:cuisine
          },
      {},(err,result)=>{
        Restaurant.find({
                rest_name: rest_name,
                rest_id: rest_id
            
        },(err,rest) => {
            if(err)
                res.json({update: '',errMsg: 'Cannot updtae rest'+e.message,rest:''})
            res.json({ update: result, errMsg: "no error", rest: rest });
        })
    })
})
/** make edits here */
//using kafka
/* router.get('/getCustomerById',passport.authenticate('jwt', { session: false }),(req,res)=>{
    console.log(req.query.customer_id);
    const req_packet = {
        end_pt: '/getCustomerById',
        body: req.query.customer_id
    }
    kafka.make_request('custTopic',req_packet,function(err,customers){
        if(err){
            res.json({
                success:false,
                errMsg:'can get cust',
                customer:[]
            })
        }
        res.json({
            success:true,
            errMsg:"",
            customer:customers[0]
        })
    })
})
 */
router.get('/getRestByRestId',passport.authenticate('jwt', { session: false }),(req,res)=>{
    console.log(req.query.rest_id);
    Restaurant.find({
       
            rest_id:req.query.rest_id
    
    },(err,rests)=>{
        res.json({
            success:true,
            errMsg:"",
            rests:rests[0]
        })
    })
})
module.exports = router;