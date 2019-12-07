const graphql = require('graphql');
const _ = require('lodash');
const { Customer, Items, Orders, OrderDetails, Owner, Restaurant } = require('../MongoDB/Mongoose')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: ( ) => ({
        customer_id: { type: GraphQLInt },
        customer_name: { type: GraphQLString },
        customer_email: { type: GraphQLString },
        customer_address: { type: GraphQLString }
    })
});
const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    fields: ( ) => ({
        owner_id: { type: GraphQLInt },
        owner_name: { type: GraphQLString },
        owner_email: { type: GraphQLString },
        owner_contactNumber: { type: GraphQLInt }
    })
})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: { customer_id: { type: GraphQLInt } },
            resolve(parent, args){
                return Customer.findOne({
                    customer_id: args.customer_id
                })
            }
        },
        owner: {
            type: OwnerType,
            args: { owner_id: { type: GraphQLInt } },
            resolve(parent, args){
                return Owner.findOne({
                    owner_id: args.owner_id
                })
            }
        }
    }
});
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        updateCustomer: {
            type: CustomerType,
            args: {
                customer_id: {type: GraphQLInt},
                customer_name: { type: GraphQLString },
                customer_email: { type: GraphQLString },
                customer_address: { type: GraphQLString}
                
            },
            resolve(parent, args){
              
                return Customer.updateOne({
                    customer_id: args.customer_id
                },{
                    customer_name: args.customer_name,
                    customer_email: args.customer_email,
                    customer_address: args.customer_address                    
                } /*  ,{},(err,result)=>{
                    console.log("hello folks")
                    Customer.findOne({
                        customer_name: "Aishwarya"
                    }).then(res=>{
                        console.log(res)
                        return res
                        //resolve(res)
                    })
                } */  );
           
            }
        },
        updateOwner: {
            type: OwnerType,
            args: {
                owner_id: { type: GraphQLInt },
                owner_name: { type: GraphQLString },
                owner_email: { type: GraphQLString },
                owner_contactNumber: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Owner.updateOne({
                    owner_id: args.owner_id,
                },{
                    owner_name: args.owner_name,
                    owner_email: args.owner_email,
                    owner_contactNumber: args.owner_contactNumber
                })
            }   
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

