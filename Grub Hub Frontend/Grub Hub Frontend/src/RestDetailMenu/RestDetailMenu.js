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

  import { gql } from 'apollo-boost';
  import { graphql } from 'react-apollo';
  import ApolloClient from 'apollo-boost';
  
  const client = new ApolloClient({
      uri: 'http://localhost:3001/graphQL'
    });
  

class RestDetailMenu extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             items:[],
             quantity:'',
             rest:"",
             sections:[],
             numList:[],
             sectionsSubPageList:[],
             sectionsGq:[]
        }
        this.quantityhandler=this.quantityhandler.bind(this);
    }
    quantityhandler = (e)=>{
        this.setState({
            quantity:e.target.value
        })
    }
    componentDidMount() {
        client.query({
            query:gql`
            query getAllSections($rest_id:Int)
            {
                getAllSections(rest_id:$rest_id) {
                    rest_id
                    items {
                        item_name
                        item_desc
                        item_price
                        rest_id
                        item_tag
                      }
                      sectionName
                }
            }
          `,
          variables:{rest_id:this.props.restIdSelected}
        }).then(response => {console.log('jijiji');
        console.log(response.data.getAllSections[0])
        this.setState({
            sectionsGq:response.data.getAllSections
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
        let breakfastItems = null; let lunchItems = null; let dinnerItems = null; let sectionNames = null;
        var redirect = null;
        if (!cookie.load('token'))
            redirect = <Redirect to="/" />
        if(this.state.sectionsGq != null) {
            sectionNames = this.state.sectionsGq.map(section=>{
                return <div class="col-md-12 mx-auto bg-white p-3 border">
                    
                             <h3 align="left">  {section.sectionName}:</h3>
                             <table align="center" class="table bg-white">
                                {
                                    section.items.map(item=>{
                                        if(item.item_tag == section.sectionName)
                                    return  <tr><td>  {item.item_name}</td><td>{item.item_desc}</td><td>{item.item_price}</td></tr>
                                    })
                                }
                                </table>

                        </div>
            })
        }
        if (this.state.sectionList != null) {
            sectionNames = this.state.sectionList.map(section => {
                return <div class="col-md-12 mx-auto bg-white p-3 border">
                    <h3 align="left">  {section.sectionName}:</h3>
                    <div className="dinner">
                        <table align="center" class="table bg-white">
                            <tr>
                                <th width="500px"></th>
                                <th width="500px">Item Image</th>
                                <th width="500px">Item name</th>
                                <th width="500px">Item description</th>
                                <th width="500px">Item Price</th>
                                <th width="500px">change section</th>
                                <th width="500px">breakfast/lunch/dinner</th>
                            </tr>
                            {
                                this.state.items.map(item => {
                                    if (item.item_tag === section.sectionName)
                                        return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler} /></td></tr>
                                })
                            }
                        </table>
                    </div>
                    <br />
                </div>

            })
        }
        if (this.state.items != null) {
            breakfastItems = this.state.items.map(item => {
                if (item.item_tag === 'breakfast')
                    return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler} /></td></tr>
            })
            lunchItems = this.state.items.map(item => {
                if (item.item_tag === 'lunch')
                    return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler} /></td></tr>
            })
            dinnerItems = this.state.items.map(item => {
                if (item.item_tag === 'dinner')
                    return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler} /></td></tr>
            })
        }
        return (
            <div style={sectionStyle}>
                {redirect}
                <NavCustomer/>
                <div class="container">
                   
                    <div>
                        <br />

                        {sectionNames}
                    </div>
                </div>
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
