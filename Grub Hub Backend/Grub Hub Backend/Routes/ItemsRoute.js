var express = require('express')
var pool = require('../DBConfig/MySQLconfig')
var router = express.Router();
var mysql = require('mysql')
var cacheIt = require('../Cache/Cache')
var sessionStorage = require('sessionstorage')
var middleware = require('../Middleware/middleware')
var upload = require('../Middleware/FileUploadMiddleware')
var passport = require('passport')
const { Customer, Owner, Order, Restaurant, Items, OrderDetails } = require('../Sequelize/Sequelize')
//earlier /
/* router.get('/allItems',[cacheIt,middleware],(req,res)=>{
    //In CUD operations remember to delete the cache
    console.log(req.url)
    console.log(req.headers.host)
    pool.pool.getConnection(function(err,connection) {
        if(err)
        console.log('error occured while connceting')
        //console.log(connection)

        var sql = mysql.format("select * from items");
        connection.query(sql,(err,rows,fields)=>{
            if(!err){
                console.log('db conn to items success');
                console.log(rows)
                sessionStorage.setItem('items',{items:rows})
                res.json({items:rows});
            }
        })

    })
}) */
router.get('/allItems',passport.authenticate('jwt', { session: false }),(req,res)=>{
    Items.findAll().then(items=>{
        console.log(items);
        res.json({
            items:items,
            success:true,
            errMsg:""
        })
    }).catch(e=>{
        res.json({
            items:null,
            success:false,
            errmsg:"Error occured"
        });
    })
})
//earlier /:itemName
//get restaurants which have a food item as searched by the user
router.get('/restsByItem',(req,res)=>{
    console.log(req.query.itemName);
    Items.findAll({
        attributes: ['rest_id'],
        where:{
            item_name:{
                $like:'%'+req.query.itemName+'%'
            }
        }
    }).then(items=>{
        console.log(items);
       // res.end(JSON.stringify(items));
        restId=[];
        for(let i of items){
            restId.push(i.rest_id);
        }
        Restaurant.findAll({
            
            where:{
                rest_id:{
                    $in:restId
                }
            }
        }).then(rest=>{
            console.log(rest);
            res.json({restos:rest})
        })


    })
})
router.post('/addRest',(req,res)=>{
    console.log(req.body)
    const {rest_name, rest_contact, rest_zip, rest_address,cuisine} = req.body;
    const resto = {
        rest_name:rest_name,
        rest_contact:rest_contact,
        rest_zip:rest_zip,
        rest_address:rest_address,
        cuisine:cuisine
    }
    console.log(resto);
    Restaurant.create(resto).then(it=>{
        res.json({
            success:true,
            rest:it,
            errMsg:""
        })
    }).catch(e=>{
        res.json({
            success:false,
            item:null,
            errMsg:"Can't add item"
        })
    })
})
/* router.get('/restByItem',(req,res)=>{
    console.log(req.params.itemName);
    console.log(req.query.itemName);
    pool.pool.getConnection((err,connection)=>{
        console.log('connection established')
        if(err)
        {   console.log('error connecting to db');
            res.end('error connecting')
        }
        else{
            var sql = mysql.format("select * from restaurant where rest_id IN (select rest_id from items where item_name LIKE '%"+req.query.itemName+"%')")
            connection.query(sql,(err,rows,fields)=>{
                if(!err){
                    console.log('db conn to items success');
                    console.log(rows)
                    sessionStorage.setItem('items',{items:rows})
                    res.json({items:rows});
                }
            })
        }
    })
    //res.end('success found')
}) */
router.post('/deleteItem',(req,res)=>{
    const {item_id,rest_id}=req.body;
    Items.destroy({
        where:{item_id:item_id}
    }).then(i=>{
        Items.findAll({
            where:{
                rest_id:rest_id
            }
        }).then(items=>{
            console.log(items)
            res.json({
                success:true,
                items:items,
                errMsg:""
            })
        })
    }).catch(e=>{
        res.json({
            success:false,
            item:null,
            errMsg:"Can't delete item"
        })
})
})
router.post('/updateTagOfItem',(req,res)=>{
    const {item_id,updatedTag,rest_id}=req.body;
    Items.update({
        item_tag:updatedTag,

    },{
        where:{
            item_id:item_id
        }
    }).then((i)=>{
        Items.findAll({
            where:{
                rest_id:rest_id
            }
        }).then(items=>{
            console.log(items)
            res.json({
                success:true,
                items:items,
                errMsg:""
            })
        })
    }).catch(e=>{
        res.json({
            success:false,
            item:null,
            errMsg:"Can't update item"
        })
})
})

router.post('/addItem',upload.single('item_image'),(req,res)=>{
    console.log(req.body)
    const {item_name, item_desc, item_price, rest_id, item_tag, item_image} = req.body;
    console.log(req.filename)
    const item = {
        item_name:item_name,
        item_desc:item_desc,
        item_price:item_price,
        rest_id:rest_id,
        item_tag:item_tag,
        item_image:'http://localhost:3001'+req.filename
    }
    console.log(item_desc);
    Items.create(item).then(it=>{
        /* res.json({
            success:true,
            item:it,
            errMsg:"" */
            Items.findAll({
                where:{
                    rest_id:rest_id
                }
            }).then(items=>{
                console.log(items)
                res.json({
                    success:true,
                    items:items,
                    errMsg:""
                })
            })
        }).catch(e=>{
            res.json({
                success:false,
                item:null,
                errMsg:"Can't add item"+e.message
            })
    })/* .catch(e=>{
        res.json({
            success:false,
            item:null,
            errMsg:"Can't add item"
        }) */
    })

//request should be like /getItemsByRest?rest_id=1
router.get('/getItemsByRest',(req,res)=>{
    console.log('get items inside'+req.params.rest_id);
    console.log('in query'+req.query.rest_id)
    Items.findAll({
        where:{
            rest_id:req.query.rest_id
        }
    }
    ).then((items)=>{
        console.log(items);
        res.json({success:true,errMsg:"",items:items});
    }).catch((e)=>{res.json({success:false,errMsg:"",items:null})});
})

router.post('/addOrder',(req,res)=>{
    console.log(req.body)
    const {rest_id,item_id,order_status,order_quantity,customer_id} = req.body;
    const order = {
        rest_id,
        item_id,
        order_status,
        order_quantity,
        customer_id
    }
    Order.create(order)
    .then(order=>{
            Order.findAll({where:{
                customer_id:customer_id
            }}).then(orders=>{
                res.json({success:true,msg:'we are preparing your order',orders:orders})
            })
    }).catch(e=>{res.json({success:false,msg:'we cannot process your order',orders:null})})
})
router.get('/getOrdersByCustId',(req,res)=>{
    console.log(req.query.customer_id);
    Order.findAll({where:{
        customer_id:req.query.customer_id
    }}).then(orders=>{
        res.json({success:true,msg:'your orders',orders:orders})
    })
})

/* router.get('/getOrdersByOwnerId',(req,res)=>{
    console.log(req.query.owner_id);
    Order.findAll({where:{
        owner_id:req.query.owner_id
    }}).then(orders=>{
        res.json({success:true,msg:'your orders',orders:orders})
    })
}) */
///getOrdersByRest?rest_id=
router.get('/getOrdersByRest',(req,res)=>{
    console.log(req.query.rest_id);
    Order.findAll({
        where:{
            rest_id:req.query.rest_id
        }
    }
    ).then((orders)=>{
        console.log(orders);
        res.json({success:true,errMsg:"",orders:orders});
    }).catch((e)=>{res.json({success:false,errMsg:"",orders:null})});
})

router.get('/getItembyItemId',(req,res)=>{
    console.log(req.query.item_id);
    Items.findAll({
        where:{
            item_id:req.query.item_id
        }
    })
    .then(items=>{
        res.json({success:false,errMsg:"",item:items[0]})
    }).catch((e)=>{res.json({success:false,errMsg:"No item found",item:null})})
})
router.post('/updateOrderStatus',(req,res)=>{
    console.log(req.body.order_id)
    const {order_id,order_status}=req.body;
    Order.update({
        order_status:order_status
    },{
        where:{
            order_id:order_id
        }
    }).then(i=>{
        res.json({success:true,errMsg:"",orderUpdated:i})
    })
})

router.post('/addOrderViaCart',(req,res)=>{
    console.log(req.body);
    const {rest_id,order_status,order_details,order_cost,customer_id}=(req.body);

    let order={
        rest_id:rest_id,
        order_status:order_status,
        order_cost:order_cost,
        customer_id:customer_id
    }
    console.log(order_details)
    Order.create(order).then(order=>{
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
        OrderDetails.bulkCreate(order_details,{returning:true})
        .then(details=>{
            console.log(details[0].item_id)
            res.json({success:true,errMsg:"",details:details})
        })
    })
})

router.get("/getOrderDetailsByOrderId",(req,res)=>{
    OrderDetails.findAll({
        where:{
            order_id:req.query.order_id
        }
    }).then(details=>{res.json({success:true,errMsg:"",details:details})})
})

module.exports = router;