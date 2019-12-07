import React, { Component } from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import {connect} from 'react-redux' 
import {signInUser} from '../../Action'
import {Redirect} from 'react-router'
import Navbaar from '../Navbar/Navbaar'
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import Reducers from '../../Reducers/index'
import './CustomerLogin.css'
import back1 from '../../../public/back.jpg'

var sectionStyle = {
  width: "100%",
  height: "550px",
  backgroundImage: `url(${back1})`
};
class CustomerLogin extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email:"",
             password:"",
             redirectVar:"",
             errors:{}
        }
        this.emailHandler=this.emailHandler.bind(this);
        this.passwordHandler=this.passwordHandler.bind(this);
        this.login=this.login.bind(this);
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
    login = (e) =>{
        e.preventDefault();
        axios.defaults.withCredentials = true;
        const data={
            
            email:this.state.email,
            password:this.state.password
        }
        if(this.validateForm(data)){
        axios.post('http://localhost:3001/details/customerSignIn',data)
        .then((response)=>{
            console.log(response.data);
            console.log(cookie.load('token'));
          
            console.log(response.data.cust)
            console.log('before'+this.props.signedInUser)
            this.props.signInUser(response.data.cust[0])
            console.log('after'+this.props.signedInUser)
            console.log(this.props.signInUser(response.data.cust[0]));
            //redirectVar=<Redirect to= "/login"/>
            localStorage.setItem('profile',response.data.cust[0])
            this.setState({
                redirectVar :<Redirect to= "/homeCustomer"/>
            }) 
        })
    }
    }
    validateForm(data) {
        let errors = {};

        let formIsValid = true;
        if (!data.email) {
            formIsValid = false;
            errors["emailid"] = "*Please enter your email-ID.";
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
        console.log(this.props)
        return (
            <div style={sectionStyle}>
                {this.state.redirectVar}
                <Navbaar/>
                <br/>
                <div class="container">
                    <div class="row">
                        <div class="col-md-3">
                            </div>
                     <div  class="col-md-6  p-3 ">
                         <div class="card">
                        <div class="card-header"><h3>Login as Customer</h3>
                        </div> 
                        <div class="card-body">   
                            <form /* class="was-validated" */> 
                               <div class="form-group">
                                   
                                    <input type="text" className="form-control" onChange={this.emailHandler} name="email" placeholder="email" required/>
                                    <div class="text-danger">{this.state.errors.emailid}.</div>
                                   
                                </div>

                               <div class="form-group">
                                    <input type="password" className="form-control" onChange={this.passwordHandler} name="password" placeholder="password" required/>
                                    <div class="text-danger">{this.state.errors.password}.</div>
                                 
                                </div>
                         
                                    <input type="button" onClick={this.login} value="Login" className="btn float-right btn-success login_btn" />
                                
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
const mapStateToProps=(state)=>{
    console.log('new state'+state);
    return {
        signedInUser:state.signedInUser
    };
    //this signed in user is key which is used in this file as this.props.signedInUser
}
export default connect(mapStateToProps, {signInUser:signInUser})(CustomerLogin)
//2nd signInUser is action creator
//1st signInuser is key name of action creator that is passed in props and used above