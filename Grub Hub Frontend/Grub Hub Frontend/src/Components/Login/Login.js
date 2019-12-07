import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import {Redirect} from 'react-router';
class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email:"",
            password:"",
            token:"",
            redirectVar:"" 
        }
        this.checkTokenSubmit=this.checkTokenSubmit.bind(this);
        this.emailhandler=this.emailhandler.bind(this);
        this.passwordhandler=this.passwordhandler.bind(this);
    }
    passwordhandler=(e)=>{
        this.setState({
            password:e.target.value
        })
    }
    emailhandler=(e)=>{
        this.setState({
            email:e.target.value
        })
    }
    checkTokenSubmit = ()=>{
        axios.defaults.withCredentials = true;
        const data={
            
            email:this.state.email,
            password:this.state.password
        }
        axios.post('http://localhost:3001/testToken',data)
        .then((response)=>{
            console.log(response.data);
            console.log(cookie.load('token'));
            this.setState({
                token: cookie.load('token')
            })
            console.log(response)
            //redirectVar=<Redirect to= "/login"/>
            this.setState({
                redirectVar : <Redirect to= "/homeCustomer"/>
            })
        })
    }
    
    render() {
        return (
            <div>
                <input type ='text' onChange = {this.emailhandler} name='email' />
                <br/>
                <input type='password' onChange = { this.passwordhandler} name='password'/>
                <button onClick = {this.checkTokenSubmit}>click me</button>
                {this.state.redirectVar}
            </div>
        )
    }
}

export default Login
