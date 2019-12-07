const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index.js')

const { Customer, Owner, Order, Restaurant, Items, OrderDetails } = require('../Sequelize/Sequelize');

it('check getitemsbyid',()=>{
    return chai.request(app)
    .get('/items/allItems')
    .then(()=>{
        return Items.findAll();
    })
    .then(result=>{
        expect(result).to.have.lengthOf(4);
        
    })
})

it('check getOrdersByCustId',()=>{
    return chai.request(app)
    .get('/items/getOrdersByCustId')
    .then(()=>{
        const customer_id=1;//   req.query.customer_id;
        return Order.findAll({
            where:{
                customer_id:customer_id
            }
        })
    })
    .then(result=>{
        expect(result[0].customer_id).to.be.equal(1);
    })
})

it('check addRest',()=>{
    return chai.request(app)
    .post('/items/addRest')
    .send({
        rest_name:"Radisson",
        rest_contact:123,
        rest_zip:234,
        rest_address:"San Fransisco",
        cuisine:"Thai"
    })
    .then(()=>{
        return Restaurant.findAll({
            where:{
                rest_name:"Radisson"
            }
        })
    })
    .then(result=>{
        const rest = result[0];
        console.log(rest)
        expect(rest.rest_name).to.be.equal('Radisson')
    })
})

it('check addOrder',()=>{
    return chai.request(app)
    .post('/items/addOrder')
    .send({
        rest_id:1,
        item_id:1,
        order_status:"new",
        order_quantity:2,
        customer_id:1
    })
    .then((response)=>{
        expect(response).to.have.status(200);
    })
})

it('check updateOrder',()=>{
    return chai.request(app)
    .post('/items/updateOrder')
    .send({
        order_id:1,
        order_status:"new"
    })
    .then(()=>{
        return Order.findAll({
            where:{
                order_id:1
            }
        })
    })
    .then(orders=>{
        const order = orders[0];
        expect(order.order_status).to.be.equal('new')
    })
})