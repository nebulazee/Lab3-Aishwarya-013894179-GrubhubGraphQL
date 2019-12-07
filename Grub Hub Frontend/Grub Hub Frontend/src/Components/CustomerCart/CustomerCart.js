import React, { Component } from 'react'
import { connect } from 'react-redux'
import NavCustomer from '../NavCustomer/NavCustomer'
import Axios from 'axios'
import {deleteCart} from '../../ItemAction'
import {deletePrice} from '../../ItemAction'
import cookie from 'react-cookies'
class CustomerCart extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        this.order=this.order.bind(this);
    }
    order=(e)=>{
        e.preventDefault();
        const data={
            rest_id:this.props.restIdSelected,
            order_status:'new',
            order_details:this.props.itemsInCart.items,
            order_cost:this.props.price,
            customer_id:this.props.signedInUser.customer_id
        }
        Axios.post('http://localhost:3001/items/addOrderViaCart',data,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            console.log(response.data);
            alert('we are preparing your order');
            this.props.deleteCart();
            this.props.deletePrice();
        })
    }

    render() {
        var c = 1;
        const orderedItem = this.props.itemsInCart.items.map(item => {
            return <tr>
                <th scope="row">{c++}</th>
                <td>{item.item_name}</td>
                <td>{item.item_quantity}</td>

            </tr>;
        })
        return (
            <div>
                <NavCustomer />
                <div class="container">
                <div class="col-md-8 mx-auto bg-white p-3 border">
                <table class="table">
                    <thead class="black white-text">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Item Name</th>
                            <th scope="col">Item Quantity</th>

                        </tr>
                    </thead>
                    
                    <tbody>
                        {orderedItem}
                        
                        <tr>
                            
                            <th scope="col">Amount to be Paid:</th>
                            <th scope="col">{this.props.price}</th>
                            <th scope="col"><button class="btn-success" onClick={this.order}>Checkout</button></th>

                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead class="black white-text">
                        
                    </thead>
                   
                </table>
            </div>
            </div>
                
            </div>
        )
    }
}
const mapStateToProps = (state) => {

    return {
        signedInUser: state.signedInUser,
        ordersOfCustomer: state.ordersOfCustomer,
        itemsInCart: state.itemsInCart,
        price: state.price,
        restIdSelected:state.restIdSelected


    }
}
export default connect(mapStateToProps,{deleteCart:deleteCart,deletePrice:deletePrice})(CustomerCart)
