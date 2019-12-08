import React, { Component } from 'react'
import Axios from 'axios'
import NavCustomer from '../Components/NavCustomer/NavCustomer'
import {ordersOfCustomer} from '../ItemAction'
import {itemAdd} from '../ItemAction'
import {calcPrice} from '../ItemAction'
import cookie from 'react-cookies'
import {
    Button,
    Input,
    Footer,
    Card,
    CardBody,
    CardImage,
    CardTitle,
    CardText
  } from "mdbreact";
  import {connect} from 'react-redux'
  import {Redirect} from 'react-router'
  import back1 from '../../public/homeCust.jpg'

  var sectionStyle = {
    width: "100%",
    height: "550px",
    backgroundImage: `url(${back1})`
  };
class RestDetailMenu extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             items:[],
             quantity:'',
             rest:"",
             sections:[],
             numList:[],
             sectionsSubPageList:[]
        }
        this.quantityhandler=this.quantityhandler.bind(this);
    }
    quantityhandler = (e)=>{
        this.setState({
            quantity:e.target.value
        })
    }
    componentDidMount() {
        console.log("search " + this.props.itemSelected)
        Axios.get("http://localhost:3001/details/getRestByRestId?rest_id="+this.props.restIdSelected,{headers:{'Authorization':cookie.load('token')}})
            .then(response => {
                this.setState({
                    rest: response.data.rests
                })
                Axios.get("http://localhost:3001/items/getSections?rest_id="+this.props.restIdSelected,{headers:{'Authorization':cookie.load('token')}})
                .then(response=>{
                    this.setState({
                        sections:response.data.sections
                    })
                    var tempList=null;
                    tempList = this.state.sections.slice(0, 1)
                    this.setState({
                        sectionsSubPageList: tempList
                    })
                    var pages=this.state.sections.length/2;
                        var numberList=[];let c=1;
                        for(let i of this.state.sections){
                            let page_no = c;
                            let start=(page_no-1)*1;
                            const numdata = {
                                page_no:c,
                                start:(page_no-1)*1,
                                end:start+1
                            }
                            console.log(numdata)
                            c++;
                            numberList.push(numdata);
                        }
                        this.setState({
                            numList:numberList
                        })
                    Axios.get("http://localhost:3001/items/getItemsByRest?rest_id=" + this.props.restIdSelected,{headers:{'Authorization':cookie.load('token')}})
                    .then((response => {
                        console.log(response.data.items);
                        this.setState({
                            items: response.data.items
                        })

                    }))
                })

            })
    }
    orderItem =(itemId)=>{
        const data={
            rest_id:this.props.restIdSelected,
            item_id:itemId,
            order_status:'new',
            order_quantity:this.state.quantity,
            customer_id:this.props.signedInUser.customer_id
        }
        Axios.post('http://localhost:3001/items/addOrder',data)
        .then((response)=>{
            console.log(response.data.orders);
            this.props.ordersOfCustomer(response.data.orders);
            alert(response.data.msg);
        })
    }
    addToCart = (itemId,itemName,itemPrice)=>{
        const data={
            item_id:itemId,
            item_name:itemName,
            item_quantity:this.state.quantity
        }
        this.props.itemAdd(data);
        this.props.calcPrice(itemPrice*this.state.quantity)


    }
    setSublist = (page)=>{
        let tempList=null;
        if(page!=null)
        tempList=this.state.sections.slice(page.start,page.end)
        this.setState({
            sectionsSubPageList:tempList
        })
    }
    render() {
        var sectionNames=null;
        if(this.state.sections!=null){
            sectionNames= this.state.sectionsSubPageList.map(section=>{
                return  <div class="col-md-12 mx-auto bg-white p-3 border">
                <h3 align="left">  {section.sectionName}:</h3>
                  <div className="dinner">
                     <table align="center" class="table bg-white">
                    
                         {
                             this.state.items.map(item=>{
                                if(item.item_tag===section.sectionName)
                                return <Card>
                                <CardBody>
                                  { <p className="">
                                        <img
                                          src={item.item_image}
                                          /* className={"flag flag-" +} */
                                            width="100"
                                            height="100"
                                            align="left"
                                        />
                                      </p> }
                                  <CardTitle /* onClick={()=>this.goToRestDetails(rest.rest_id)}  */value={item.item_id} title={item.item_name}>
                                           <table border="0">
                                               <tr><th>Item</th>
                                               <th width="300px">Description</th>
                                               {/* <th>Item Section</th> */}
                                               
                                               <th width="300px">Item Price</th>
                                               <th width="300px">Item Quantity</th>
                                               </tr>
                                               <tr>
                                               <td>{item.item_name}</td>
                                               <td>{item.item_desc}</td>
                                               {/* <td>{item.item_tag}</td> */}
                                               <td>{item.item_price}</td>
                                               <td><input type='text' name='quantity' placeholder="Enter Quantity" onChange={this.quantityhandler}/></td>
                                               
                                               <td><button onClick={()=>this.addToCart(item.item_id,item.item_name,item.item_price)}>Add</button></td>
                                               </tr></table>
                                  </CardTitle>
                                  
                                </CardBody>
                              </Card>
                             })
                         }
                         </table>
                  </div>
                  <br/>
                  </div>
            })
        }

        return (
            <div style={sectionStyle}>
                <NavCustomer/>
                <h3>{this.state.rest.rest_name} Menu</h3>
                <marquee direction="right">Hurry! Order Now..</marquee>
                {<nav aria-label="pagination">
                    <ul class="pagination justify-content-end">
                        {this.state.numList.map(page => {
                            return <li class="page-item" ><button onClick={()=>this.setSublist(page)} class="page-link">{page.page_no}</button></li>
                        })}
                    </ul>
                </nav>}
                    {sectionNames}

            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    console.log(state)
    return {
        signedInUser:state.signedInUser,
        itemSelected:state.itemSelected,
        restIdSelected:state.restIdSelected
    }
}
export default connect(mapStateToProps,{ordersOfCustomer:ordersOfCustomer,itemAdd:itemAdd,calcPrice:calcPrice})(RestDetailMenu)
