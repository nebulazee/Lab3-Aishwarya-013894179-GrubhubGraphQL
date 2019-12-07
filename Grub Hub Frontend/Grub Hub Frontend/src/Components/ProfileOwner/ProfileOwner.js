import React, { Component } from 'react'
import  NavOwner  from '../NavOwner/NavOwner'
import Axios from 'axios'
import {connect} from 'react-redux' 
import {signInUser} from '../../Action'
import cookie from 'react-cookies'
import {Redirect} from 'react-router'
import back1 from '../../../public/homeCust.jpg'

var sectionStyle = {
  width: "100%",
  height: "550px",
  backgroundImage: `url(${back1})`
};

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphQL'
  });


class ProfileOwner extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             name:this.props.signedInUser.owner_name,
             email:this.props.signedInUser.owner_email,
             contact:this.props.signedInUser.owner_contactNumber,
             image:"http://localhost:3001"+this.props.signedInUser.owner_image,
            /*  restaurant:this.props.signedInUser.re */
        }
        this.updateOwner=this.updateOwner.bind(this);
        this.addPhoto=this.addPhoto.bind(this);
        this.imagehandler=this.imagehandler.bind(this);

        this.contacthandler=this.contacthandler.bind(this);
        this.namehandler=this.namehandler.bind(this);
        this.emailhandler=this.emailhandler.bind(this);
       // this.addresshandler=this.addresshandler.bind(this);
     /*    this.cuisinehandler=this.cuisinehandler.bind(this);
        this.restauranthandler=this.restauranthandler.bind(this); */
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
    contacthandler = (e)=>{
        this.setState({
            contact:e.target.value
        })
    }             
  
    imagehandler = (e)=>{
        this.setState({
            image:e.target.files[0]
        })
    }

    updateOwnerGQL = (e) => {
        client.mutate({
            mutation:gql`
            mutation updateOwner($owner_id:Int,$owner_name:String,$owner_email:String,$owner_contactNumber:Int)
            {
                updateOwner(owner_id:$owner_id,owner_name:$owner_name,owner_email:$owner_email,owner_contactNumber:$owner_contactNumber) {
                    owner_name
                    owner_email
                    owner_contactNumber
                    owner_id
                }
            }
          `,
            variables:{owner_id:this.props.signedInUser.owner_id,owner_name:this.state.name,owner_email:this.state.email,owner_contactNumber:this.state.contact}
        }).then(res=>{
            console.log("updation successful")
          
        })
       
    }


    
    addPhoto=(e)=>{
        /*  const data={
             customer_id:this.props.signedInUser.customer_id,
             customer_image:this.state.image,
             customer_name:this.state.name
         } */
 
         const data = new FormData();
         data.append('owner_id', this.props.signedInUser.owner_id);
         data.append('owner_image', this.state.image);
         data.append('owner_name', this.state.name);
         console.log(data);
 
         const headers = {
             'content-type': 'multipart/form-data',
             'Authorization': cookie.load('token')
         }
         console.log(data.owner_image)
         Axios.post('http://localhost:3001/details/addOwnerPhoto',data,{headers})
         .then((response)=>{
             console.log(response);
             this.setState({
                 image:"http://localhost:3001"+response.data.own[0].owner_image
             })
             //change reducers also
             const newOwn=response.data.own[0];
             console.log("image-----"+this.state.image)
             //this.props.signInUser()
             let owner={
                owner_id:newOwn.owner_id,
                owner_name:newOwn.owner_name,
                owner_image:newOwn.owner_image,
                owner_contactNumber:newOwn.owner_contactNumber,
                owner_email:newOwn.owner_email,
                rest_id:newOwn.rest_id,
                rest_name:newOwn.rest_name,
                rest_address:this.props.signedInUser.rest_address,
                rest_zip:this.props.signedInUser.rest_zip,
                rest_contact:this.props.signedInUser.rest_contact,
                cuisine:this.props.signedInUser.cuisine,
                rest_image:this.props.signedInUser.rest_image
            }
            this.props.signInUser(owner);
         })
     }
    render() {
        let redirectvar=null;
        if(!cookie.load('token'))
            redirectvar=<Redirect to='/ownerLogin'/>
        return (
            <div style={sectionStyle}>
                <NavOwner /> 
            <div className="container">
                <br/>
                    <div class="table-responsive">
                    <table class="table table bg-white"   border="0">
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
                            <th>Contact</th>
                            <td><input type="text" onChange={this.contacthandler} class="form-control" value={this.state.contact} name="contact" /></td>
                        </tr>
                        <tr >
                            <td colspan="2">
                            <input type="button" onClick={this.addPhoto} class="btn btn-primary " value="Upload Photo" />
                            </td>
                            <td>
                            <button type="button" onClick={this.updateOwnerGQL}/* {this.updateOwner} */ class="btn btn-primary">Update</button>
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
    console.log('profile owner state '+state);
    console.log(JSON.stringify(state))
    return {
        signedInUser:state.signedInUser
    };
}
export default connect(mapStateToProps,{signInUser:signInUser})(ProfileOwner)
