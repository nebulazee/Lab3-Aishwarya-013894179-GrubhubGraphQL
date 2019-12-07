const { Customer, Items, Orders, OrderDetails, Owner, Restaurant ,Messages} = require('../MongoDB/Mongoose')
var passport = require('passport')
var express = require('express')
var jwt = require('jsonwebtoken');
var router = express.Router();

var cacheIt = require('../Cache/Cache')
var sessionStorage = require('sessionstorage')
var middleware = require('../Middleware/middleware')
var upload = require('../Middleware/FileUploadMiddleware')
const bcrypt = require('bcrypt')
var salt = bcrypt.genSaltSync(10);
//var kafka = require('../KafkaClient/KafkaClient')


router.get('/allItems',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Items.find({},(err,items)=>{

        if(err){
            res.json({
                items:null,
                success:false,
                errmsg:"Error occured"
            });
        }
        console.log(items);
        res.json({
            items:items,
            success:true,
            errMsg:""
        })
    })
})
//using kafka
/* router.get('/allItems',passport.authenticate('jwt', { session: false }),(req,res)=>{
    const req_packet = {
        end_pt: '/allItems',
        body: ''
    }
    kafka.make_request('itemTopic',req_packet,function(err,results){
        if(err){
            res.json({
                items:null,
                success:false,
                errmsg:"Error occured"
            });
        }
        res.json({
            items:results,
            success:true,
            errMsg:""
        })
    })
    
}) */
router.get('/restsByItem',passport.authenticate('jwt', { session: false }),(req,res)=>{
    console.log(req.query.itemName);
    Items.find({
        item_name:{
             $regex: '.*' + req.query.itemName + '.*' 
        }
    },'rest_id',(err,items)=>{
        console.log(items);
        restId=[];
        for(let i of items){
            restId.push(i.rest_id);
        }
        Restaurant.find({
            rest_id:{
                $in:restId
            }
        }, (err,rest)=>{
            console.log(rest);
            res.json({restos:rest})
        })
    })
})


router.post('/addRest',passport.authenticate('jwt', { session: false }),(req,res)=>{
    console.log(req.body)
    const {rest_name, rest_contact, rest_zip, rest_address,cuisine} = req.body;
    const resto = new Restaurant({
        rest_name:rest_name,
        rest_contact:rest_contact,
        rest_zip:rest_zip,
        rest_address:rest_address,
        cuisine:cuisine
    })
    console.log(resto);
    resto.save((err,it)=>{
        if(err)
        {
            res.json({
                success:false,
                item:null,
                errMsg:"Can't add Rest"
            })
        }
        res.json({
            success:true,
            rest:it,
            errMsg:""
        })
    })
  
})

router.post('/deleteItem',passport.authenticate('jwt', { session: false }),(req,res)=>{
    const {item_id,rest_id}=req.body;
    Items.deleteOne({
        item_id:item_id
    },(err)=>{
        Items.find({
            rest_id:rest_id
        },(err,items)=>{
            if(err){
                res.json({
                    success:false,
                    item:null,
                    errMsg:"Can't delete item"
                })
            }
            console.log(items)
            res.json({
                success:true,
                items:items,
                errMsg:""
            })
        })
    })
})
/* router.post('/addItem',passport.authenticate('jwt', { session: false }),upload.single('item_image'),(req,res)=>{
    console.log(req.body)
    const req_packet = {
        end_pt: '/addItem',
        body:
                { body:req.body,
                image:req.filename
            }
       
    }
    kafka.make_request('itemTopic',req_packet,function(err,result){
        if(err){
            res.json({
                success:false,
                item:null,
                errMsg:"Can't add item"+e.message
            })
        }
        
        res.json({
            success:true,
            items:result,
            errMsg:""
        }) 
    })
 }) */
router.post('/addItem',passport.authenticate('jwt', { session: false }),upload.single('item_image'),(req,res)=>{
    console.log(req.body)
    const {item_name, item_desc, item_price, rest_id, item_tag, item_image} = req.body;
    console.log(req.filename)
    const item = new Items({
        item_name:item_name,
        item_desc:item_desc,
        item_price:item_price,
        rest_id:rest_id,
        item_tag:item_tag,
        item_image:'http://localhost:3001'+req.filename
    })
    console.log(item_desc);
    item.save((err,it)=>{
            Items.find({
                    rest_id:rest_id
            },(err,items)=>{
                if(err){
                    res.json({
                        success:false,
                        item:null,
                        errMsg:"Can't add item"+e.message
                    })
                }
                console.log(items)
                res.json({
                    success:true,
                    items:items,
                    errMsg:""
                })
            })
        })
    })

  /*   router.post('/updateTagOfItem',passport.authenticate('jwt', { session: false }),(req,res)=>{
        const req_packet = {
            end_pt:'/updateTagOfItem',
            body:req.body
        }
        kafka.make_request('itemTopic',req_packet,function(err,result){
            if(err)
                {
                    res.json({
                        success:false,
                        items:null,
                        errMsg:"Can't update item"
                    })
                }
              
                res.json({
                    success:true,
                    items:result,
                    errMsg:""
                })
            
        })
    }) */
    router.post('/updateTagOfItem',passport.authenticate('jwt', { session: false }),(req,res)=>{
        const {item_id,updatedTag,rest_id}=req.body;
        Items.update({
                item_id:item_id
        },{
            item_tag:updatedTag,
        },{},(err,result)=>{
            Items.find({
                    rest_id:rest_id
            },(err,items)=>{
                if(err)
                {
                    res.json({
                        success:false,
                        item:null,
                        errMsg:"Can't update item"
                    })
                }
                console.log(items)
                res.json({
                    success:true,
                    items:items,
                    errMsg:""
                })
            })
        })
    })
    //kafka
/*     router.get('/getItemsByRest',(req,res)=>{
        console.log('get items inside'+req.params.rest_id);
       const req_packet = {
           end_pt:'/getItemsByRest',
           body:req.query.rest_id
       }
        kafka.make_request('itemTopic',req_packet,function(err, result){
            if(err){
                res.json({success:false,errMsg:"",items:null})
            }
           
            res.json({success:true,errMsg:"",items:result});
       })
    }) */
    //fired from inside the getRestByRestId
    router.get('/getItemsByRest',(req,res)=>{
        console.log('get items inside'+req.params.rest_id);
        console.log('in query'+req.query.rest_id)
        Items.find({
                rest_id:req.query.rest_id
        },(err,items)=>{
            if(err){
                res.json({success:false,errMsg:"",items:null})
            }
            console.log(items);
            res.json({success:true,errMsg:"",items:items});
        })
    })
    //kafka
/*     router.get('/getOrdersByCustId',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.query.customer_id);
        const req_packet = {
            end_pt:'/getOrdersByCustId',
            body:req.query.customer_id
        }
        kafka.make_request('orderTopic',req_packet,function(err,result){
            if(err) {
                console.log(err)
            }
            res.json({success:true,msg:'your orders',orders:result})
        })
    }) */
    router.get('/getOrdersByCustId',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.query.customer_id);
        Orders.find({
            customer_id:req.query.customer_id
        },(err,orders)=>{
            if(err)
            console.log(err)
            res.json({success:true,msg:'your orders',orders:orders})
        })
    })
    //kafka
 /*    router.get('/getOrdersByRest',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.query.rest_id);
      const req_packet = {
          end_pt: '/getOrdersByRest',
          body: req.query.rest_id
      }
      kafka.make_request('orderTopic',req_packet,function(err,result){
          if (err)
              res.json({ success: false, errMsg: "", orders: null })
          //console.log(orders);
          res.json({ success: true, errMsg: "", orders: result }); 

      })
    }) */
    router.get('/getOrdersByRest',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.query.rest_id);
        Orders.find({
                rest_id:req.query.rest_id
            }
        ,(err,orders)=>{
            if(err)
                res.json({success:false,errMsg:"",orders:null})
            console.log(orders);
            res.json({success:true,errMsg:"",orders:orders}); 
        })
    })

    router.get('/getItembyItemId',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.query.item_id);
        Items.find({
                item_id:req.query.item_id
        },(err,items)=>{
            if(err)
                 res.json({success:false,errMsg:"No item found",item:null})
            res.json({success:false,errMsg:"",item:items[0]})
        })
        
    })
   /*  router.post('/updateOrderStatus',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.body.order_id)
        const req_packet = {
            end_pt:'/updateOrderStatus',
            body:req.body
        }
        kafka.make_request('orderTopic',req_packet,function(err,result){
            if(err)
                console.log(err)
            res.json({success:true,errMsg:"",orderUpdated:result})
        })
    }) */
    router.post('/updateOrderStatus',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.body.order_id)
        const {order_id,order_status}=req.body;
        Orders.update({
                order_id:order_id
        },{
            order_status:order_status
        },{},(err,i)=>{
            res.json({success:true,errMsg:"",orderUpdated:i})
        })
    })
    
   /*  router.get("/getOrderDetailsByOrderId",passport.authenticate('jwt', { session: false }),(req,res)=>{
       const req_packet = {
           end_pt:'/getOrderDetailsByOrderId',
           body:req.query.order_id
       }
       kafka.make_request('orderTopic',req_packet,function(err,result){
           if(err){
               console.log(err)
           }
           res.json({success:true,errMsg:"",details:result})
       })
    }) */

    router.get("/getOrderDetailsByOrderId",passport.authenticate('jwt', { session: false }),(req,res)=>{
        OrderDetails.find({
                order_id:req.query.order_id
        },(err,details)=>{
            res.json({success:true,errMsg:"",details:details})
        })
    })
/* 
    router.post('/addMsgCust',passport.authenticate('jwt',{session:false}),(req,res)=>{
        const req_packet = {
            end_pt:'/addMsgCust',
            body:req.body
        }
        kafka.make_request('itemTopic',req_packet,function(err,result){
            if(err){
                console.log(err)
            }
            res.json({success:true,errMsg:"",msg:result})
        })
    }) */
    router.post('/addMsgCust',passport.authenticate('jwt',{session:false}),(req,res)=>{
        const {order_id,receiver_id,sender_id,text}=req.body;
        Owner.findOne({
            rest_id:receiver_id
        },(err,owner)=>{
            const message=new Messages({
                order_id:order_id,
                receiver_id:owner.owner_id,
                sender_id:sender_id,
                text:text
            })
            message.save((err,msg)=>{
                res.json({success:true,errMsg:"",msg:msg})
            })
        }) 
    })
  /*   router.post('/addMsg',passport.authenticate('jwt',{session:false}),(req,res)=>{
       const req_packet={
           end_pt:'/addMsg',
           body:req.body
       }
       kafka.make_request('itemTopic',req_packet,function(err,result){
           if(err){
            console.log(err)
           }
           res.json({success:true,errMsg:"",msg:result})

       })
    }) */
    router.post('/addMsg',passport.authenticate('jwt',{session:false}),(req,res)=>{
        const {order_id,receiver_id,sender_id,text}=req.body;
        const message=new Messages({
            order_id:order_id,
            receiver_id:receiver_id,
            sender_id:sender_id,
            text:text
        })
        message.save((err,msg)=>{
            res.json({success:true,errMsg:"",msg:msg})
        })
    })
    //using kafka
    /* router.get('/updateChat',passport.authenticate('jwt',{session:false}),(req,res)=>{
     const req_packet = {
         end_pt: '/updateChat',
         body: req.query.order_id
     }
        kafka.make_request('itemTopic',req_packet,function(err,chat) {
            res.json({success:true,errmsg:"",chat:chat}) 
      })
    }) */
    router.get('/updateChat',passport.authenticate('jwt',{session:false}),(req,res)=>{
        Messages.find({
            order_id:req.query.order_id
        },(err,chat)=>{
            res.json({success:true,errmsg:"",chat:chat})
        })
    })

//using kafka
/* router.post('/addOrderViaCart',passport.authenticate('jwt', { session: false }),(req,res)=>{
   const req_packet = {
       end_pt: '/addOrderViaCart',
       body: req.body
   }
   kafka.make_request('itemTopic',req_packet,function(err,details) {
       if(err) {
        console.log(err);
       }
       res.json({
        success:true,
        errMsg:"",
        details:details
       })
   })
}) */
    router.post('/addOrderViaCart',passport.authenticate('jwt', { session: false }),(req,res)=>{
        console.log(req.body);
        const {rest_id,order_status,order_details,order_cost,customer_id}=(req.body);
    
        let order = new Orders({
            rest_id:rest_id,
            order_status:order_status,
            order_cost:order_cost,
            customer_id:customer_id
        })
        console.log(order_details)
        order.save((err,order)=>{
            const order_id=order.order_id;
            console.log('order_id:'+order_id);
            /* order_details=order_details.array.forEach(element => {
                element.order_id=order_id;
            }); */
            for(let i of order_details){
                console.log(i)
                i.order_id=order_id
                console.log(i.order_id)
    
            }
            OrderDetails.insertMany(order_details)
            .then(details=>{
                console.log(details[0].item_id)
                res.json({success:true,errMsg:"",details:details})
            })
        })
    })

    //.............................make edits here...........................//
    //kafka
    /* router.post('/addSection',passport.authenticate('jwt', { session: false }),(req,res)=>{
        const req_packet = {
            end_pt: '/addSection',
            body: req.body
        }
        kafka.make_request('itemTopic',req_packet,function(err,details) {
            if(err) {
             console.log(err);
            }
            res.json({
             success:true,
             errMsg:"",
             sections:details
            })
        })
     })
     router.get('/getSections',passport.authenticate('jwt', { session: false }),(req,res)=>{
        const req_packet = {
            end_pt: '/getSections',
            body: req.query.rest_id
        }
        kafka.make_request('itemTopic',req_packet,function(err,sections) {
            if(err) {
             console.log(err);
            }
            res.json({
             success:true,
             errMsg:"",
             sections:sections
            })
        })
     }) */
module.exports = router;