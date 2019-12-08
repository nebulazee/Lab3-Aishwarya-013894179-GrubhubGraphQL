const graphql = require('graphql');
const _ = require('lodash');
const { Customer, Items, Orders, OrderDetails, Owner, Restaurant, Sections } = require('../MongoDB/Mongoose')
const bcrypt = require('bcrypt')
var salt = bcrypt.genSaltSync(10);

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

const SectionType = new GraphQLObjectType({
    name: 'Section' ,
    fields: ( ) => ({
        sectionName: { type: GraphQLString },
        rest_id: { type: GraphQLInt },
        items: {
            type: GraphQLList(Itemtype),
            resolve(parent, args) {
                return Items.find({
                    rest_id : parent.rest_id
                })
            }
        }
    })
})
const Itemtype = new GraphQLObjectType({
    name: 'Item',
    fields: ( ) => ({
        item_name:  { type: GraphQLString },
        item_desc:  { type: GraphQLString },
        item_price: { type: GraphQLInt },
        rest_id:    { type: GraphQLInt },
        item_tag:   { type: GraphQLString },
    })

})
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: ( ) => ({
        customer_id: { type: GraphQLInt },
        customer_name: { type: GraphQLString },
        customer_email: { type: GraphQLString },
        customer_address: { type: GraphQLString },
        customer_password: { type: GraphQLString }
    })
});
const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    fields: ( ) => ({
        owner_id: { type: GraphQLInt },
        owner_name: { type: GraphQLString },
        owner_email: { type: GraphQLString },
        owner_contactNumber: { type: GraphQLInt },   //
    })
})

const AddOwnerType = new GraphQLObjectType({
    name: 'AddOwner',
    fields: ( ) => ({
        owner_id: { type: GraphQLInt },
        owner_name: { type: GraphQLString },
        owner_password: { type: GraphQLString },
        owner_email: { type: GraphQLString },
        owner_contactNumber: { type: GraphQLInt },   //
        rest_name: {type: GraphQLString },
        rest_contact: {type:GraphQLInt },
        rest_zip: {type: GraphQLInt },
        rest_address: {type: GraphQLString },
        cuisine: {type: GraphQLString }

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
        },
        getAllSections: {
            type: GraphQLList(SectionType),
            args: { rest_id: { type: GraphQLInt } },
            resolve(parent, args) {
                return Sections.find({
                    rest_id: args.rest_id
                })
            }
        }
        
    }
});
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
               
                customer_name: { type: GraphQLString },
                customer_email: { type: GraphQLString },
                customer_address: { type: GraphQLString},
                customer_password: { type: GraphQLString}
            },
            resolve(parent, args) {
                const cust = new Customer({
                    customer_name: args.customer_name,
                    customer_email: args.customer_email,
                    customer_password: bcrypt.hashSync(args.customer_password, salt),
                    customer_address: args.customer_address
                });
                return cust.save();
            }
        },
        addOwner: {
            type:  AddOwnerType ,
            args: {
               
                owner_name: { type: GraphQLString },
                owner_password: { type: GraphQLString },
                owner_email: { type: GraphQLString },
                owner_contactNumber: { type: GraphQLInt },   //
                rest_name: {type: GraphQLString },
                rest_contact: {type:GraphQLInt },
                rest_zip: {type: GraphQLInt },
                rest_address: {type: GraphQLString },
                cuisine: {type: GraphQLString }
            },
            resolve(parent, args) {
                const rest= new Restaurant({
                    rest_name:args.rest_name,
                    rest_contact:args.rest_contact,
                    rest_zip:args.rest_zip,
                    rest_address:args.rest_address,
                    cuisine:args.cuisine
                })
                rest.save((err,rest)=>{
                    const own = new Owner({
                        owner_name: args.owner_name,
                        owner_email: args.owner_email,
                        owner_password: bcrypt.hashSync(args.owner_password,salt),
                        owner_contactNumber: args.owner_contactNumber,
                        rest_id: rest.rest_id,
                        rest_name: rest.rest_name
                    })
                    return own.save();
                })
            }
        },
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
                }   );
           
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
        },
        addSection: {
            type: SectionType,
            args: {
                sectionName: { type: GraphQLString },
                rest_id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const section = new Sections({
                    sectionName: args.sectionName,
                    rest_id: args.rest_id
                })
               return  section.save()
            }
        },
        addItem: {
            type: Itemtype,
            args: {
                item_name: { type: GraphQLString },
                item_desc: { type: GraphQLString },
                item_price: { type: GraphQLInt},
                rest_id :{ type: GraphQLInt },
                item_tag: { type: GraphQLString }
            },
            resolve(parent, args) {
                console.log(args);
                const item = new Items({
                    item_name : args.item_name,
                    item_desc : args.item_desc,
                    item_price: parseInt(args.item_price),
                    rest_id   : args.rest_id,
                    item_tag  : args.item_tag
                })
                return item.save().catch(err=>console.log(err));
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

