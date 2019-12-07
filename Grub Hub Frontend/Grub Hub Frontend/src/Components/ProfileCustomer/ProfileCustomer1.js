import React, { Component } from 'react'
import './ProfileCustomer.css'
import {connect} from 'react-redux' 
import {signInUser} from '../../Action'
import Axios from 'axios'
import NavCustomer from '../NavCustomer/NavCustomer'

import back1 from '../../../public/homeCust.jpg'
import cookie from 'react-cookies';
  var sectionStyle = {
    width: "100%",
    height: "550px",
    backgroundImage: `url(${back1})`
  };
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

  const getProfileQuery = gql`
  {
      customer(customer_id:2) {
          customer_name
          customer_id
      }
  }
`;

class ProfileCustomer extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             name:this.props.signedInUser.customer_name,
             email:this.props.signedInUser.customer_email,
             address:this.props.signedInUser.customer_address,
             image:"http://localhost:3001"+this.props.signedInUser.customer_image
        }
        this.updateCustomer=this.updateCustomer.bind(this);
        this.addPhoto=this.addPhoto.bind(this);
        this.imagehandler=this.imagehandler.bind(this);

        this.namehandler=this.namehandler.bind(this);
        this.emailhandler=this.emailhandler.bind(this);
        this.addresshandler=this.addresshandler.bind(this)
        console.log("main gql")
        console.log(this.props.getProfileQuery(2))
    }
    namehandler = (e)=>{
        this.setState({
            name:e.target.value
        })
    }     
    emailhandler = (e)=>{
        this.setState({
            email:e.target.value
        })
    } 
    addresshandler = (e)=>{
        this.setState({
            address:e.target.value
        })
    }                                                                                                                                                                                                                                           
    updateCustomer = (e)=>{
        const data={
            customer_id:this.props.signedInUser.customer_id,
            customer_name:this.state.name,
            customer_email:this.state.email,
            customer_address:this.state.address

        }
        Axios.post("http://localhost:3001/details/updateCustomer",data,{headers:{'Authorization':cookie.load('token')}})
        .then((response)=>{
            console.log(response.data.cust[0].customer_name)
            this.props.signInUser(response.data.cust[0]);
        })
    }
    updateCustomerGQL = (e) => {

    }
    imagehandler = (e)=>{
        this.setState({
            image:e.target.files[0]
        })
    }
    addPhoto=(e)=>{
       /*  const data={
            customer_id:this.props.signedInUser.customer_id,
            customer_image:this.state.image,
            customer_name:this.state.name
        } */

        const data = new FormData();
        data.append('customer_id', this.props.signedInUser.customer_id);
        data.append('customer_image', this.state.image);
        data.append('customer_name', this.state.name);
        console.log(data);

        const headers = {
            'content-type': 'multipart/form-data',
            'Authorization': cookie.load('token')
        }
        console.log(data.customer_image)
        Axios.post('http://localhost:3001/details/addCustomerPhoto',data,{headers})
        .then((response)=>{
            console.log(response);
            this.setState({
                image:"http://localhost:3001"+response.data.cust[0].customer_image
            })
            //change reducers also
            console.log("image-----"+this.state.image)
            this.props.signInUser(response.data.cust[0]);
        })
    }
    render() {
        return (
            <div style={sectionStyle}>
            <NavCustomer/>
            <div className="container">
                <br/>
            <div class="table-responsive">
                
                    <table class="table table bg-white"  border="0">
                        <tr>
                        <td rowspan="2"> <img src={this.state.image} height="200" width="250" alt="" className="img-rounded img-responsive" /></td>
                            <th>Name:</th>
                            <td><input type="text" onChange={this.namehandler} class="form-control" value={this.state.name} name="name" /></td>
                        </tr>
                        <tr>
                           
                            <th>Email:</th>
                            <td><input type="email" onChange={this.emailhandler} class="form-control" value={this.state.email} name="email" /></td>
                           
                          
                        </tr>
                        <tr>
                            <td align="center"><form  enctype="multipart/form-data" method="POST">
                                <input type="file" onChange={this.imagehandler} name="owner_image" accept="image/*" />
                               
                            </form></td>
                            <th>Address:</th>
                            <td><input type="text" onChange={this.addresshandler} class="form-control" value={this.state.address} name="address" /></td>
                        </tr>
                        <tr >
                            <td colspan="2">
                            <input type="button" onClick={this.addPhoto} class="btn btn-primary " value="Upload Photo" />
                            </td>
                            <td>
                            <button type="button" onClick={this.updateCustomer} class="btn btn-primary">Update</button>
                            </td>
                        </tr>
                    </table>
                    </div>
            
            </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    console.log('jkjkjk'+state);
    console.log(JSON.stringify(state))
    return {
        signedInUser:state.signedInUser
    };
}
//export default connect(mapStateToProps,{signInUser:signInUser})(ProfileCustomer);
export default graphql(getProfileQuery)(ProfileCustomer);