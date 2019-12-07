import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import NavCustomer from '../NavCustomer/NavCustomer'
import cookie from 'react-cookies'
import back1 from '../../../public/homeCust.jpg'

  var sectionStyle = {
    width: "100%",
    height: "550px",
    backgroundImage: `url(${back1})`
  };
class CustomerOrders extends Component {
    constructor(props) {
        super(props)

        this.state = {
            orders: [],
            detail:[],
            order_price:"",
            orderedRestDetails:"",
            chat_messages_history:[],
            sendMsg:"",
            receiver_id:"",
            current_order_id:""
        }
        this.sendmessageHandler=this.sendmessageHandler.bind(this);
        console.log(this.props.ordersOfCustomer);
    }
    componentDidMount() {
        console.log('who ordered' + this.props.signedInUser.customer_id)
        Axios.get('http://localhost:3001/items/getOrdersByCustId?customer_id=' + this.props.signedInUser.customer_id,{headers:{'Authorization':cookie.load('token')}})
            .then((response) => {
                console.log(response.data.orders);
                this.setState({
                    orders: response.data.orders
                    
                })
            })
    }

    sendMessage = (rest_id,order_id)=>{
        const data={
            order_id:this.state.current_order_id,
            receiver_id:this.state.receiver_id,
            sender_id:this.props.signedInUser.customer_id,
            text:this.state.sendMsg
        }
        Axios.post('http://localhost:3001/items/addMsgCust',data,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            console.log("message sent")
        })
    }

    updateChat=(rest_id,order_id)=>{
        this.setState({
            current_order_id:order_id,
            receiver_id:rest_id
        })
        Axios.get('http://localhost:3001/items/updateChat?order_id='+order_id,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            this.setState({
                chat_messages_history : response.data.chat
            })
            console.log(this.state.chat_messages_history)
        })
    }
    sendmessageHandler = (e)=>{
        this.setState({
            sendMsg:e.target.value
        })
    }
    getOrderDetails = (order_id,order_price,rest_id) => {
        this.setState({
            order_price:order_price
        })
        Axios.get('http://localhost:3001/items/getOrderDetailsByOrderId?order_id=' + order_id,{headers:{'Authorization':cookie.load('token')}})
            .then((response) => {
                this.setState({
                    detail: response.data.details
                })
                Axios.get('http://localhost:3001/details/getRestByRestId?rest_id='+rest_id,{headers:{'Authorization':cookie.load('token')}})
                .then((response)=>{
                    this.setState({
                        orderedRestDetails:response.data.rests
                    })
                })
            })

    }
    render() {
        let messages=null;
        messages = this.state.chat_messages_history.map(msg=>{
            console.log("jk cement"+msg.text)
                if(msg.sender_id==this.props.signedInUser.customer_id){
                    
                    return (
                        
                        <div className="d-flex justify-content-end bg-secondary mb-3" align="right">
                           <div class="p-2 bg-info"> {msg.text}</div>
                        </div>
                    )
                }
                else{
                    return (
                        <div class="d-flex justify-content-start bg-secondary mb-3">
                           <div class="p-2 bg-warning"> {msg.text}</div>
                        </div>
                    )
                    
                }
        })
        var count = 0;
       
        let new_orders = this.state.orders.map(order => {
            console.log(order)
            if(order.order_status=='new')
            return (
                <tr>
                    <td>
                        Order {order.order_id/* count = count + 1 */}
                    </td>
                    <td>
                        {order.order_status}
                    </td>
                    <td>
                        <button onClick={() => this.getOrderDetails(order.order_id,order.order_cost,order.rest_id)} class="btn btn-primary" data-toggle="modal" data-target="#myModal">View Details</button>
                    </td>
                    <td>
                        <button  class="btn btn-primary" onClick={()=>this.updateChat(order.rest_id,order.order_id)} data-toggle="modal" data-target="#chatModal">chat</button>
                    </td>
                    <div class="modal fade" id="chatModal">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">


                                <div class="modal-header">
                                    <h4 class="modal-title">Order Details</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>


                                <div class="modal-body">
                                  {messages}
                                
                                 </div>

                                <div class="">
                                    <input type="text" onChange={this.sendmessageHandler}class="form-control"/>
                                   
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" onClick={()=>this.sendMessage(order.rest_id,order.order_id)}>Send</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="myModal">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">


                                <div class="modal-header">
                                    <h4 class="modal-title">Order Details</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>


                                <div class="modal-body">
                                    <table>
                                        <th>
                                            Restaurant Name:
                                            </th>
                                        <tr>
                                            <td>
                                                {this.state.orderedRestDetails.rest_name}
                                                </td>
                                            </tr>
                                        </table>
                                   <table>
                                       <th>
                                            Item Name
                                        </th>
                                        <th>
                                            Item Quantity
                                        </th>
                                    {
                                        this.state.detail.map(item=>{
                                        return <tr>
                                            <td>{item.item_name}</td><td>{item.item_quantity}</td>
                                        </tr>
                                    })}
                                    </table>
                                    <hr/>
                                    Total:{this.state.order_price}
                                 </div>


                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </tr>


            )
        })
        let past_orders = this.state.orders.map(order => {
            console.log(order)
            if(order.order_status=='Delivered')
            return (
                <tr>
                    <td>
                        Order {order.order_id/* count = count + 1 */}
                    </td>
                    <td>
                        {order.order_status}
                    </td>
                    <td>
                        <button onClick={() => this.getOrderDetails(order.order_id,order.order_cost,order.rest_id)} class="btn btn-primary" data-toggle="modal" data-target="#myModal">View Details</button>
                    </td>
                    <td>
                        <button  class="btn btn-primary" onClick={()=>this.updateChat(order.rest_id,order.order_id)} data-toggle="modal" data-target="#chatModal">chat</button>
                    </td>
                    <div class="modal fade" id="chatModal">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">


                                <div class="modal-header">
                                    <h4 class="modal-title">Order Details</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>


                                <div class="modal-body">
                                  {messages}
                                
                                 </div>

                                <div class="">
                                    <input type="text" onChange={this.sendmessageHandler}class="form-control"/>
                                   
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" onClick={()=>this.sendMessage(order.rest_id,order.order_id)}>Send</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="myModal">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">


                                <div class="modal-header">
                                    <h4 class="modal-title">Order Details</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>


                                <div class="modal-body">
                                    <table>
                                        <th>
                                            Restaurant Name:
                                            </th>
                                        <tr>
                                            <td>
                                                {this.state.orderedRestDetails.rest_name}
                                                </td>
                                            </tr>
                                        </table>
                                   <table>
                                       <th>
                                            Item Name
                                        </th>
                                        <th>
                                            Item Quantity
                                        </th>
                                    {
                                        this.state.detail.map(item=>{
                                        return <tr>
                                            <td>{item.item_name}</td><td>{item.item_quantity}</td>
                                        </tr>
                                    })}
                                    </table>
                                    <hr/>
                                    Total:{this.state.order_price}
                                 </div>


                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </tr>


            )
        })
        return (
            <div style={sectionStyle}>
                <NavCustomer />
                <br />
                <div class="container">
                    <div class="col-md-8 mx-auto bg-white p-3 border" >
                <table align="center">
                    <tr><th>
                        Order id
                         </th>
                        <th>
                            Order Status
                         </th>
                    </tr>
                    Past Orders:
                    {past_orders}
                    Upcoming Orders:
                    {new_orders}
                </table>
                </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    //
    return {
        signedInUser: state.signedInUser,
        ordersOfCustomer: state.ordersOfCustomer
    }
}
export default connect(mapStateToProps)(CustomerOrders)
