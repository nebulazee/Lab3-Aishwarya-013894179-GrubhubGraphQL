import {combineReducers} from "redux";


const signedInUserReducer = (signedInUser=null,action)=>{
    if(action.type==='USER_ACTIVE'){
        return action.payload;
    }
    return signedInUser;
}
const itemSelectedReducer = (itemSelected=null,action)=>{
    if(action.type==='ITEM_SELECTED')
        return action.payload
    return itemSelected;
}
const initialItems = {
    items:[]
}
const itemAddReducer = (itemsAdded=initialItems,action)=>{
    if(action.type==='ITEM_CART')
    return {
        items:itemsAdded.items.concat(action.payload)
    }
    else if(action.type==='DELETE_CART')
    return {
        items:[]
    }
    return itemsAdded;
}
const restSelectedReducer = (restIdSelected=null,action)=>{
    if(action.type==='REST_SELECTED')
        return action.payload;
    return restIdSelected;
}

const orderCustomerReducer = (ordersOfCustomer=null,action)=>{
    if(action.type==='ORDERS')
        return action.payload
    return ordersOfCustomer;
}
const priceReducer = (price=0,action)=>{
    if(action.type==='CALC_PRICE')
        return action.payload+price
    else if(action.type==='DELETE_PRICE')
    return 0;    
    return price;
}
/* const deleteCartReducer = ()=>{

} */
export default combineReducers({
    signedInUser:signedInUserReducer,
    itemSelected:itemSelectedReducer,
    restIdSelected:restSelectedReducer,
    ordersOfCustomer:orderCustomerReducer,
    itemsInCart:itemAddReducer,
    price:priceReducer
})