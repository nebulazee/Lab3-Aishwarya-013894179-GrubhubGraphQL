import React, { Component } from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import NavOwner from '../NavOwner/NavOwner'
import cookie from 'react-cookies'
import {Redirect} from 'react-router'
import back1 from '../../../public/homeCust.jpg'

var sectionStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: `url(${back1})`
};
class MenuOwner extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             items:[],
             rest_id:this.props.signedInUser.rest_id,
             item_name:"",
             item_desc:"",
             item_price:"",
             
             item_tag:"",
             item_image:"",
             updatedTag:"",
             section:""

        }

        this.itemnamehandler=this.itemnamehandler.bind(this);
        this.itemdeschandler=this.itemdeschandler.bind(this);
        this.itempricehandler=this.itempricehandler.bind(this);
        this.itemtaghandler=this.itemtaghandler.bind(this);
        this.addItem=this.addItem.bind(this);
        console.log("constructor loaded")
        //this.componentDid()
        this.taghandler=this.taghandler.bind(this);
        this.updateTag=this.updateTag.bind(this);
        this.deleteItem=this.deleteItem.bind(this);
    }
    updateTag=(e)=>{
        e.preventDefault();
        const data={
            item_id:e.target.value,
            updatedTag:this.state.updatedTag,
            rest_id:this.state.rest_id
        }
        //getting the target button or item's id
        console.log(e.target.value)
        Axios.post('http://localhost:3001/items/updateTagOfItem',data,{headers:{'Authorization':cookie.load('token')}})
        .then((response)=>{
            const items=response.data.items;
            console.log(typeof(items))
            console.log(items);
            this.setState({
                items:items
            })
        })
    }
    itemnamehandler = (e)=>{
        this.setState({
            item_name:e.target.value
        })
    }
    itemdeschandler = (e)=>{
        this.setState({
            item_desc:e.target.value
        })
    }
    itempricehandler = (e)=>{
        this.setState({
            item_price:e.target.value
        })
    }
    itemtaghandler = (e)=>{
        this.setState({
            item_tag:e.target.value
        })
    }
    sectionhandler = (e)=>{
        this.setState({
            section:e.target.value
        })
    }
    deleteItem=(e)=>{
        e.preventDefault();
        const data={
            item_id:e.target.value,
            rest_id:this.state.rest_id
        }
        Axios.post('http://localhost:3001/items/deleteItem',data,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            const items=response.data.items;
            console.log(typeof(items))
            console.log(items);
            this.setState({
                items:items
            })
        })
    }
    addSection = (e)=>{
        e.preventDefault();
        const data = {
            sectionName:this.state.section,
            rest_id:this.state.rest_id
        }
        Axios.post('http://localhost:3001/items/addSection',data,{headers:{'Authorization':cookie.load('token')}})
        .then(response=>{
            const sections = response.data.sections;
            console.log(typeof(sections))
            console.log(sections);
            this.setState({
                sectionList:sections
            })
        })
    }
    addItem= (e)=>{
        e.preventDefault();
        
        const data = new FormData();
         data.append('item_name', this.state.item_name);
         data.append('item_desc', this.state.item_desc);
         data.append('item_price', this.state.item_price);
         data.append('rest_id', this.state.rest_id);
         data.append('item_tag', this.state.item_tag);
         data.append('item_image', this.state.item_image);
         console.log(data);
 
         const headers = {
             'content-type': 'multipart/form-data',
             'Authorization':cookie.load('token')
         }
        
        /* const data={
            item_name:this.state.item_name,
            item_desc:this.state.item_desc,
            item_price:this.state.item_price,
            rest_id:this.state.rest_id,
            item_tag:this.state.item_tag
        } */
        Axios.post("http://localhost:3001/items/addItem",data,{headers})
        .then((response=>{
            const items=response.data.items;
            console.log(typeof(items))
            console.log(items);
            this.setState({
                items:items
            })
        }))
    }

    imagehandler = (e)=>{
        this.setState({
            item_image:e.target.files[0]
        })
    }
    /* deletehandler=(e)=>{
        this.setState({
            deleted_item:e.target.value
        })
    } */
    taghandler=(e)=>{
        console.log(e.target.value)
        this.setState({
            updatedTag:e.target.value
        })
    }
    componentDidMount(){

        console.log("menu mounted")
        Axios.defaults.withCredentials = true;
        //take id from redux store
        
        Axios.get("http://localhost:3001/items/getSections?rest_id="+this.state.rest_id,{headers:{'Authorization':cookie.load('token')}})
        .then((response)=>{
            this.setState({
                sectionList:response.data.sections
            })
            Axios.get("http://localhost:3001/items/getItemsByRest?rest_id="+this.state.rest_id,{headers:{'Authorization':cookie.load('token')}})
             .then((response)=>{
            const items=response.data.items;
            console.log(typeof(items))
            console.log(items);
            this.setState({
                items:items
            })
        })
        })
    }
    
    render() {
        let breakfastItems=null;let lunchItems=null;let dinnerItems=null;let sectionNames=null;
        var redirect = null;
        if (!cookie.load('token'))
            redirect = <Redirect to="/" />
        
        if(this.state.sectionList!=null){
            sectionNames= this.state.sectionList.map(section=>{
                return  <div class="col-md-12 mx-auto bg-white p-3 border">
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
                             this.state.items.map(item=>{
                                if(item.item_tag===section.sectionName)
                                return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler}/></td></tr>
                             })
                         }
                         </table>
                  </div>
                  <br/>
                  </div>
                   
            })
        }
        if(this.state.items!=null){
        breakfastItems= this.state.items.map(item=>{
            if(item.item_tag==='breakfast')
                return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler}/></td></tr>
        })
        lunchItems = this.state.items.map(item=>{
            if(item.item_tag==='lunch')
                return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler}/></td></tr>
        })
        dinnerItems = this.state.items.map(item=>{
            if(item.item_tag==='dinner')
                return <tr><td><button onClick={this.deleteItem} value={item.item_id}>Delete</button> </td><td> <img src={item.item_image} height="100" width="100" alt="" className="img-rounded img-responsive" /></td><td>{item.item_name}</td><td> {item.item_desc}</td><td> {item.item_price}</td><td><button onClick={this.updateTag} value={item.item_id}>Update Section</button> </td><td><input type='text' onChange={this.taghandler}/></td></tr>
        })
    }
        return (
            <div style={sectionStyle}>
                {redirect}
                <NavOwner/>
                <div class="container">
                    <h3>Add Section to the Menu</h3>
                <div class="col-md-12 bg-white mx-auto p-3 border">
                <form className="form-inline">
                <div className="input-group form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.sectionhandler} name="item" placeholder="section name" />

                </div>
                <div className="form-group">
                                    <button onClick={this.addSection}  className="btn btn-success float-right login_btn" >Add Section</button>
                                </div>
                </form>
                </div>
                <h3>Add Item to the Menu</h3>
                <div class="col-md-12 bg-white mx-auto p-3 border">
                <form className="form-inline">
                <div className="input-group form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.itemnamehandler} name="item" placeholder="item name" />

                </div>
                <div className="input-group form-group">
                                   
                                    <input type="text" className="form-control" onChange={this.itemdeschandler} name="item" placeholder="item description" />

                </div>
                <div className="input-group form-group">
                                   
                                    <input type="text" className="form-control" onChange={this.itempricehandler} name="item" placeholder="item price" />

                </div>
                <div className="input-group form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.itemtaghandler} name="item" placeholder="item section" />

                </div>
                <div className="form-group">
                                    <button onClick={this.addItem}  className="btn btn-success float-right login_btn" >Add Item</button>
                                </div>
                <div className="input-group form-group">
                <form  enctype="multipart/form-data" method="POST">
                                <input type="file" onChange={this.imagehandler} name="item_image" accept="image/*" />
                               {/*  <input type="button" onClick={this.addPhoto}value="Upload Photo" /> */}
                            </form>
                </div>
               
                </form>
                </div>
            <div>
                <br/>
               {/*  <div class="col-md-12 mx-auto bg-white p-3 border">
               <h3 align="left"> BREAKFAST:</h3>
               <div className="breakfast">
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
                       {breakfastItems}
                       </table>
                </div>
                </div>
                <br/>
                <div class="col-md-12 mx-auto bg-white p-3 border">
              <h3 align="left">  LUNCH:</h3>
                <div className="lunch">
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
                       {lunchItems}
                       </table>
                </div>
                </div>
                <br/>
                <div class="col-md-12 mx-auto bg-white p-3 border">
              <h3 align="left">  DINNER:</h3>
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
                       {dinnerItems}
                       </table>
                </div>
                </div> */}
                {sectionNames}
            </div>
            </div>
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    return {
        signedInUser:state.signedInUser

    }
}
export default connect(mapStateToProps)(MenuOwner)
