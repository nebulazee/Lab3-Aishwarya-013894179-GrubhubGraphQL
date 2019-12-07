import React, { Component } from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import {connect} from 'react-redux' 
import {signInUser} from '../../Action'
import {Redirect} from 'react-router'
import Navbaar from '../Navbar/Navbaar'
import back1 from '../../../public/back.jpg'

var sectionStyle = {
  width: "100%",
  height: "550px",
  backgroundImage: `url(${back1})`
};
class OwnerLogin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email:"",
            password:"",
            redirect:"",
            errors:{}
        }
        this.loginOwner = this.loginOwner.bind(this);
        this.emailhandler = this.emailhandler.bind(this);
        this.passwordhandler = this.passwordhandler.bind(this);
    }
    emailhandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    passwordhandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    loginOwner = (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        const data = {

            email: this.state.email,
            password: this.state.password,
            /* redirect:"" */
        }
        if(this.validateForm(data)){
        axios.post('http://localhost:3001/details/ownerSignIn', data)
            .then((response) => {
                console.log(response.data.own);
                console.log(cookie.load('token'));
                /* this.setState({
                    token: cookie.load('token')
                }) */
                this.props.signInUser(response.data.own)
                console.log(this.props.signInUser(response.data.own));
                console.log(response.data.own)
                this.setState({redirect:<Redirect to='/homeOwner'/>})
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
        return (
            <div style={sectionStyle}>
                {this.state.redirect}
                <Navbaar/>
                <br/>
            <div className="container">
            <div class="row">
                        <div class="col-md-3">
                            </div>
                     <div  class="col-md-6  p-3 ">
                    <div className="card">
                        <div className="card-header">
                            <h3>Owner Sign In</h3>
                         
                        </div>
                        <div className="card-body">
                            <form class="">
                                <div className="form-group">
                                   
                                    <input type="text" className="form-control" onChange={this.emailhandler} name="email" placeholder="username" required/>
                                    <div class="text-danger">{this.state.errors.emailid}.</div>
                                </div>
                                <div className="form-group">
                                  
                                    <input type="password" className="form-control" onChange={this.passwordhandler} name="password" placeholder="password" required/>
                                    <div class="text-danger">{this.state.errors.password}.</div>
                                </div>
                                <div className="form-group">
                                    <input type="button" value="Login" onClick={this.loginOwner} className="btn btn-success float-right login_btn" />
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
const mapStateToProps=(state)=>{
    console.log('new state'+state);
    return {
        signedInUser:state.signedInUser
    };
    //this signed in user is key which is used in this file as this.props.signedInUser
}
export default connect(mapStateToProps, {signInUser:signInUser})(OwnerLogin)
