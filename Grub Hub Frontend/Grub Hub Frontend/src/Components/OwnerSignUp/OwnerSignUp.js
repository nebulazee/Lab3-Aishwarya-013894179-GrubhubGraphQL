import React, { Component } from 'react'
import axios from 'axios';
import {Redirect} from 'react-router'
import Navbaar from '../Navbar/Navbaar';

import back1 from '../../../public/back.jpg'

var sectionStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: `url(${back1})`
};
class OwnerSignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             name:"",
             email:"",
             password:"",
             contactNumber:"",
             rest_name:"",
             zip:"",
             cuisine:"",
             rest_contact:"",
             rest_address:"",   
             redirectVar:"",
             errors:{}

        }
        this.namehandler=this.namehandler.bind(this);
        this.emailhandler=this.emailhandler.bind(this);
        this.passwordhandler=this.passwordhandler.bind(this);
        this.contactNumberhandler=this.contactNumberhandler.bind(this);
        this.rest_namehandler=this.rest_namehandler.bind(this);
        this.ziphandler=this.ziphandler.bind(this);
        this.ownerSignUp=this.ownerSignUp.bind(this);
        this.cuisinehandler=this.cuisinehandler.bind(this);
        this.restcontacthandler=this.restcontacthandler.bind(this);
        this.restaddresshandler=this.restaddresshandler.bind(this);
    }
    cuisinehandler=(e)=>{
        this.setState({
            cuisine:e.target.value
        })
    }
    restcontacthandler=(e)=>{
        this.setState({
            rest_contact:e.target.value
        })
    }
    restaddresshandler=(e)=>{
        this.setState({
            rest_address:e.target.value
        })
    }
    namehandler=(e)=>{
        this.setState({
            name:e.target.value
        })
    }
    emailhandler=(e)=>{
        this.setState({
            email:e.target.value
        })
    }
    passwordhandler=(e)=>{
        this.setState({
            password:e.target.value
        })
    }
    contactNumberhandler=(e)=>{
        this.setState({
            contactNumber:e.target.value
        })
    }
    rest_namehandler=(e)=>{
        this.setState({
            rest_name:e.target.value
        })
    }
    ziphandler=(e)=>{
        this.setState({
            zip:e.target.value
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
          if (!data.rest_address) {
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
          if (!data.rest_name) {
            formIsValid = false;
            errors["rest_name"] = "*Please enter your Restaurant name.";
          }
          if (!data.cuisine) {
            formIsValid = false;
            errors["cuisine"] = "*Please enter your Cuisine.";
          }
          if (!data.rest_contact) {

            formIsValid = false;
    
            errors["rest_contact"] = "*Please enter your Restaurant contact no.";
    
          }
    
    
    
          if (typeof data.rest_contact !== "undefined") {
    
            if (!data.rest_contact.match(/^[0-9]{1,10}$/)) {
    
              formIsValid = false;
    
              errors["rest_contact"] = "*Please enter valid no.";
    
            }
    
          }

          if (!data.contactNumber) {

            formIsValid = false;
    
            errors["contact"] = "*Please enter your contact no.";
    
          }
    
    
    
          if (typeof data.contactNumber !== "undefined") {
    
            if (!data.contactNumber.match(/^[0-9]{1,10}$/)) {
    
              formIsValid = false;
    
              errors["contact"] = "*Please enter valid no.";
    
            }
    
          }

          this.setState({
            errors: errors
          });
          return formIsValid;
    }
    ownerSignUp = (e)=>{
        e.preventDefault();
        const data={
            name:this.state.name,
            email:this.state.email,
            password:this.state.password,
            contactNumber:this.state.contactNumber,
            rest_name:this.state.rest_name,
            zip:this.state.zip,
            rest_address:this.state.rest_address,
            cuisine:this.state.cuisine,
            rest_contact:this.state.rest_contact
        }
        if(this.validateForm(data)){
        axios.post('http://localhost:3001/details/addOwner',data)
        .then((response)=>{
            console.log(response.data);
            this.setState({
                redirectVar:<Redirect to='/ownerLogin'/>
            })
        })
    }
    }

    render() {
        return (
            <div style={sectionStyle}>
                <Navbaar/>
                <br/>
            <div className="container">
                
                {this.state.redirectVar}
                <div class="row">
                <div className="col-md-3">
                    </div>
                    <div class="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Owner Sign Up</h3>
                            
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                   
                                    <input type="text" className="form-control" onChange={this.namehandler} name="name" placeholder="name" />
                                    <div class="text-danger">{this.state.errors.name}</div>
                                </div>
                                <div className="form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.emailhandler} name="email" placeholder="email" />
                                    <div class="text-danger">{this.state.errors.emailid}</div>
                                </div>
                                <div className="form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.contactNumberhandler} name="contactNumber" placeholder="contact number" />
                                    <div class="text-danger">{this.state.errors.contact}</div>
                                </div>
                                <div className="form-group">
                                   
                                    <input type="text" className="form-control" onChange={this.rest_namehandler} name="rest_name" placeholder="Restaurant name" />
                                    <div class="text-danger">{this.state.errors.rest_name}</div>
                                </div>
                                <div className="form-group">
                                    
                                    <input type="text" className="form-control" onChange={this.ziphandler} name="zip" placeholder="Zip code" />
                                    <div class="text-danger">{this.state.errors.zip}</div>
                                </div>
                                <div className="form-group">
                                
                                    <input type="text" className="form-control" onChange={this.cuisinehandler} name="cuisine" placeholder="Cuisine" />
                                    <div class="text-danger">{this.state.errors.cuisine}</div>
                                </div>
                                <div className="form-group">
                                  
                                    <input type="text" className="form-control" onChange={this.restcontacthandler} name="rest_contact" placeholder="Rest. contact" />
                                    <div class="text-danger">{this.state.errors.rest_contact}</div>
                                </div>
                                <div className="form-group">
                                
                                    <input type="text" className="form-control" onChange={this.restaddresshandler} name="address" placeholder="Address" />
                                    <div class="text-danger">{this.state.errors.address}</div>
                                </div>
                                <div className="form-group">
                                    
                                    <input type="password" className="form-control" onChange={this.passwordhandler} name="password" placeholder="password" />
                                    <div class="text-danger">{this.state.errors.password}</div>
                                </div>
                               
                                <div className="form-group">
                                    <input type="button" value="Submit" onClick={this.ownerSignUp} className="btn btn-success float-right login_btn" />
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

export default OwnerSignUp
