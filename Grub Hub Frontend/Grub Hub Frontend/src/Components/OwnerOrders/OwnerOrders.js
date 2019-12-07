import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import NavOwner from '../NavOwner/NavOwner';
import back1 from '../../../public/homeCust.jpg'
import cookie from 'react-cookies';
import Draggable, {DraggableCore} from 'react-draggable'; 
 
var sectionStyle = {
  width: "100%",
  height: "550px",
  backgroundImage: `url(${back1})`
};
class OwnerOrders extends Component {   

    constructor(props) {
        super(props)
    
        this.state = {
             orders:[],
             quantity:"",
             item_detail:[],
             customer_detail:"",
             updateStatus:"",
             visibility_flag:"",
             chat_messages_history:[],
             sendMsg:"",
             sender_id:"",
             receiver_id:"",
             current_order_id:""
        }
        this.updateStatus=this.updateStatus.bind(this);
        this.statushandler=this.statushandler.bind(this);
        this.sendMessageHandler=this.sendMessageHandler.bind(this);
    }
    componentDidMount() {
        console.log('who ordered' + this.props.signedInUser.rest_id)
        Axios.get('http://localhost:3001/items/getOrdersByRest?rest_id=' + this.props.signedInUser.rest_id,{headers:{'Authorization':cookie.load('token')}})
            .then((response) => {
                console.log(response.data.orders);
                this.setState({
                    orders: response.data.orders
                    
                })
            })
    }
    getOrderDetails = (order_id,customer_id) => {
        if(this.state.visibility_flag==false){
        Axios.get('http://localhost:3001/items/getOrderDetailsByOrderId?order_id=' + order_id,{headers:{'Authorization':cookie.load('token')}})
            .then((response) => {
                console.log(response.data.details)
                this.setState({
                    item_detail: response.data.details,
                    visibility_flag: true
                })
                Axios.get('http://localhost:3001/details/getCustomerById?customer_id='+customer_id,{headers:{'Authorization':cookie.load('token')}})
                .then((response)=>{
                    this.setState({
                        customer_detail:response.data.customer
                    })
                })
            })
        }
        else {
            this.setState({
                visibility_flag:false
            })
        }

    }
    sendMessageHandler = (e)=>{
        this.setState({
            sendMsg:e.target.value
        })
    }
    statushandler =(e)=>{
        e.preventDefault();
        this.setState({
            updateStatus:e.target.value
        })
    }
    updateStatus = (order_id)=>{
        console.log(order_id)
        const data={
            order_id:order_id,
            order_status:this.state.updateStatus
        }
        Axios.post('http://localhost:3001/items/updateOrderStatus',data,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            console.log("status updtaed")
        })

    }
    sendMessage = (customer_id,order_id)=>{
        const data={
            order_id:this.state.current_order_id,
            receiver_id:this.state.receiver_id,
            sender_id:this.props.signedInUser.owner_id,
            text:this.state.sendMsg
        }
        Axios.post('http://localhost:3001/items/addMsg',data,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            console.log("message sent")
            this.setState({
                sendMsg:""
            })
            //this.updateChat();
        })
    }
    updateChat=(customer_id,order_id)=>{
        this.setState({
            sender_id:this.props.signedInUser.owner_id,
            receiver_id:customer_id,
            current_order_id:order_id
        })
        Axios.get('http://localhost:3001/items/updateChat?order_id='+order_id,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            this.setState({
                chat_messages_history : response.data.chat,
                sendMsg:""
            })
            console.log(this.state.chat_messages_history)
        })
    }
    setOrders() {
        console.log("here"+this.state);
        console.log(this.state.orders)
    }

    render() {
        var count = 0;
        let items=null;let messages=null;let customerName;
        if(this.state.visibility_flag){
        customerName="Customer Name:"+this.state.customer_detail.customer_name    
        items=this.state.item_detail.map(item=>{
            return (
            <div> <div>
                    <span className="item">{item.item_name}</span>
                 
                    <span className="quantity">x {item.item_quantity}</span>
                 </div>
            </div>
            )
        })
        
    }
    messages = this.state.chat_messages_history.map(msg=>{
        console.log("jk cement"+msg.text)
            if(msg.sender_id==this.props.signedInUser.owner_id){
                
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
        let orders = this.state.orders.map(order => {
            //this.getOrderDetails(order.order_id,order.customer_id)
            return (
                <React.Fragment>
                     <div class="modal fade" id="myModal">
                        <div class="modal-dialog modal-sm">
                            <div class="modal-content">


                                <div class="modal-header">
                                    <h4 class="modal-title">Chat</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>


                                <div class="modal-body">
                                   {messages}
                                 </div>

                                <input type="text" onChange={this.sendMessageHandler} value={this.state.sendMsg} />
                                <button type="button" onClick={()=>this.sendMessage(order.customer_id,order.order_id)} class="btn btn-secondary" >Send</button>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <Draggable enableUserSelectHack={false}>
                    <div className="ui card">
                        <div className="content">
                        <div className="header">Order# {order.order_id}</div>
                        </div>
                        <div className="content">
                        <h4 className="ui sub header">Order Status    :{order.order_status}  </h4>
                        <h4 className="ui sub header">Customer Id    :{order.customer_id}   </h4>
                        <h4 className="ui sub header">Order Cost    : {order.order_cost} </h4>
                        <div class="ui fitted divider"></div>
                        <p>Summary</p>
                        <div className="ui small feed">
                            <div className="event">
                                <div className="content">
                                    <div className="heading">
                                        <div><span className="item">Details</span> 
                                        <span className="quantity"><button onClick={()=>this.getOrderDetails(order.order_id,order.customer_id)} className="ui button">View Details</button></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="content">
                                    
                                    <div className="summary">
                                      <div>
                                        <span className="item">{customerName}</span>
                                        </div>
                                        {items}
                                        
                                    </div>
                                </div>
                            </div>                                
                        </div>
                        </div>
                        <div className="extra content">
                        <input type="text" className="form-control" onChange={this.statushandler} id="a"/>
                        <br/>
                         <button className="ui button" onClick={()=>this.updateStatus(order.order_id)}>Update Status</button> 
                         <button className="ui button" /* class="btn btn-primary" */onClick={()=>this.updateChat(order.customer_id,order.order_id)}  data-toggle="modal" data-target="#myModal">Chat</button>
                        
                        </div>
                    </div>
                    
                    </Draggable>
                </React.Fragment>
                
            )
        })
        return (
            <div style={sectionStyle}>
                <NavOwner />
                <br />
                
                <div className="container ownerOrder">
                    {orders}
                   {/*  <Draggable>
                        <div className="ui card">
                            <div className="content">
                            <div className="header">Order# 1</div>
                            </div>
                            <div className="content">
                            <h4 className="ui sub header">Order Status: Pending </h4>
                            <h4 className="ui sub header">Customer Name:  Subin </h4>
                            <h4 className="ui sub header">Customer Address: Bangalore </h4>
                            <div class="ui fitted divider"></div>
                            <p>Order Summary</p>
                            <div className="ui small feed">
                                <div className="event">
                                    <div className="content">
                                        <div className="heading">
                                           <div><span className="item">Item</span> <span className="quantity">Quantity</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="event">
                                    <div className="content">
                                        <div className="summary">
                                            <div><span className="item">Chicken</span> <span className="quantity">x2</span></div>
                                            <div><span className="item">Donuts</span> <span className="quantity">x4</span></div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                            </div>
                            <div className="extra content">
                            <button className="ui button">Update Status</button>
                            </div>
                        </div>
                    </Draggable>

                    <Draggable>
                        <div className="ui card">
                            <div className="content">
                            <div className="header">Order# 2</div>
                            </div>
                            <div className="content">
                            <h4 className="ui sub header">Order Status: Completed </h4>
                            <h4 className="ui sub header">Customer Name:  Subin </h4>
                            <h4 className="ui sub header">Customer Address: Bangalore </h4>
                            <div class="ui fitted divider"></div>
                            <p>Order Summary</p>
                            <div className="ui small feed">
                                <div className="event">
                                    <div className="content">
                                        <div className="heading">
                                           <div><span className="item">Item</span> <span className="quantity">Quantity</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="event">
                                    <div className="content">
                                        <div className="summary">
                                            <div><span className="item">Chicken</span> <span className="quantity">x2</span></div>
                                            <div><span className="item">Donuts</span> <span className="quantity">x4</span></div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                            </div>
                            <div className="extra content">
                            <button className="ui button">Update Status</button>
                            </div>
                        </div>
                    </Draggable>

                    <Draggable>
                        <div className="ui card">
                            <div className="content">
                            <div className="header">Order# 3</div>
                            </div>
                            <div className="content">
                            <h4 className="ui sub header">Order Status: Completed </h4>
                            <h4 className="ui sub header">Customer Name:  Subin </h4>
                            <h4 className="ui sub header">Customer Address: Bangalore </h4>
                            <div class="ui fitted divider"></div>
                            <p>Order Summary</p>
                            <div className="ui small feed">
                                <div className="event">
                                    <div className="content">
                                        <div className="heading">
                                           <div><span className="item">Item</span> <span className="quantity">Quantity</span></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="event">
                                    <div className="content">
                                        <div className="summary">
                                            <div><span className="item">Chicken</span> <span className="quantity">x2</span></div>
                                            <div><span className="item">Donuts</span> <span className="quantity">x4</span></div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                            </div>
                            <div className="extra content">
                            <button className="ui button">Update Status</button>
                            </div>
                        </div>
                    </Draggable> */}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    //
    return {
        signedInUser: state.signedInUser
        
    }
}
export default connect(mapStateToProps)(OwnerOrders)
