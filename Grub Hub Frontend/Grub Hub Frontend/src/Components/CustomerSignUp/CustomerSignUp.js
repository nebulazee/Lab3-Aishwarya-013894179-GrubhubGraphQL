import React, { Component } from 'react'
import axios from 'axios';
import {Redirect} from 'react-router';
import Navbaar from '../Navbar/Navbaar';

import back1 from '../../../public/back.jpg';

import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphQL'
  }); 

var sectionStyle = {
  width: "100%",
  height: "590px",
  backgroundImage: `url(${back1})`
};
class CustomerSignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email:"",
             password:"",
             name:"",
             address:"",
            errors:{},
             redirectVar:""
        }
        this.nameHandler=this.nameHandler.bind(this);
        this.passwordHandler=this.passwordHandler.bind(this);
        this.emailHandler=this.emailHandler.bind(this);
        this.addressHandler=this.addressHandler.bind(this);
       // this.customerSignUp=this.customerSignUp.bind(this);
    }
    customerSignUpGql = (e)=>{
        e.preventDefault();
        client.mutate({
            mutation:gql`
            mutation addCustomer($customer_name:String,$customer_email:String,$customer_password:String,$customer_address:String)
            {
                addCustomer(customer_name:$customer_name,customer_email:$customer_email,customer_password:$customer_password,customer_address:$customer_address) {
                    customer_name
                    customer_email
                    customer_password
                }
            }
          `,
            variables:{customer_name:this.state.name,customer_email:this.state.email,customer_password:this.state.password,customer_address:this.state.address}
        }).then(res=>{
            this.setState({
                redirectVar:<Redirect to='/customerLogin'/>
            })
        })
    }
    emailHandler = (e) =>{
        this.setState({
            email:e.target.value
        })
    }
    passwordHandler = (e)=>{
        this.setState({
            password:e.target.value
        })
    }
    nameHandler = (e)=>{
        this.setState({
            name:e.target.value
        })
    }
     
    addressHandler = (e)=>{
        this.setState({
            address:e.target.value
        })
    }
    validateForm(data){
        let errors = {};

        let formIsValid = true;
        if (!data.name) {
            formIsValid = false;
            errors["name"] = "*Please enter your name.";
          }
          if (typeof data.name !== "undefined") {
            if (!data.name.match(/^[a-zA-Z ]*$/)) {
              formIsValid = false;
              errors["name"] = "*Please enter alphabet characters only.";
            }
          }
          if (!data.address) {
            formIsValid = false;
            errors["address"] = "*Please enter your address.";
          }
          if(!data.email){
            formIsValid = false;
            errors["emailid"] = "*Please enter your email.";  
          }

          if (typeof data.email !== "") {
            //regular expression for email validation
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(data.email)) {
                formIsValid = false;
                errors["emailid"] = "*Please enter valid email-ID.";
            }
        }

        if (!data.password) {
            formIsValid = false;
            errors["password"] = "*Please enter your password.";
          }
    
          if (typeof data.password !== "undefined") {
            if (!data.password.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
              formIsValid = false;
              errors["password"] = "*Please enter secure and strong password.";
            }
          }


          this.setState({
            errors: errors
          });
          return formIsValid;
    }
    render() {
        return (
            <div style={sectionStyle}>
                  <Navbaar/>
                  <br/>
            <div className="container">
              
                {this.state.redirectVar}
                <div class="row">
                        <div class="col-md-3">
                            </div>
                     <div  class="col-md-6  p-3 ">
                    <div className="card">
                        <div className="card-header">
                            <h3>Customer Sign Up</h3>
                            <div className="d-flex justify-content-end social_icon">
                                <span><i className="fab fa-facebook-square"></i></span>
                                <span><i className="fab fa-google-plus-square"></i></span>
                                <span><i className="fab fa-twitter-square"></i></span>
                            </div>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                  
                                    <input type="text" className="form-control" onChange={this.nameHandler} name="name" placeholder="name" />
                                    <div class="text-danger">{this.state.errors.name}</div>
                                </div>
                                <div className="form-group">
                                 
                                    <input type="text" className="form-control" onChange={this.emailHandler} name="email" placeholder="email" />
                                    <div class="text-danger">{this.state.errors.emailid}</div>
                                </div>
                                
                                <div className="form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.addressHandler} name="address" placeholder="address" />
                                    <div class="text-danger">{this.state.errors.address}</div>
                                </div>
                                <div className="form-group">
                                  
                                    <input type="password" className="form-control" onChange={this.passwordHandler} name="password" placeholder="password" />
                                    <div class="text-danger">{this.state.errors.password}</div>
                                </div>

                                <div className="form-group">
                                    <input type="button" onClick={this.customerSignUpGql}  value="Submit" className="btn btn-success float-right login_btn" />
                                </div>
                            </form>
                        </div>
                      
                    </div>
                </div>
                </div>
                
            </div>
            </div>
        )
    }
}

export default CustomerSignUp
