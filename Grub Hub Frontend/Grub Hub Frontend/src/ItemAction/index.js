export const itemSelect=(item)=>{
    return {
        type:'ITEM_SELECTED',
        payload:item
    };
 };
 export const restSelect=(restId)=>{
     return {
        type:'REST_SELECTED',
        payload:restId
     }
 };
 export const ordersOfCustomer=(orders)=>{
     return {
         type:'ORDERS',
         payload:orders
     }
 };

 export const itemAdd = (item)=>{
     return {
         type:'ITEM_CART',
         payload:item
     }
 }
 export const calcPrice = (price)=>{
     return {
         type:'CALC_PRICE',
         payload:price
     }
 }
 export const deleteCart = ()=>{
     return {
         type:'DELETE_CART',
         payload:""
     }
 }
 export const deletePrice = ()=>{
    return {
        type:'DELETE_PRICE',
        payload:""
    }
 }