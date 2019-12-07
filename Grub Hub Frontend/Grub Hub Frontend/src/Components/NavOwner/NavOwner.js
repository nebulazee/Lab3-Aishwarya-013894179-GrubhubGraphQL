import React, { Component } from 'react'
import {connect} from 'react-redux' 
import {signInUser} from '../../Action'
import {Redirect} from 'react-router'
import cookie from 'react-cookies'
import {Link} from 'react-router-dom'
class NavOwner extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            redirect:"",
            loggedInUser:this.props.signedInUser
       }
       this.redirectProfileFunc=this.redirectProfileFunc.bind(this);
    this.logout=this.logout.bind(this);
    //this.migrateHome=this.migrateHome.bind(this);
    this.redirectRestaurantFunc=this.redirectRestaurantFunc.bind(this);
    this.goToMenu=this.goToMenu.bind(this);
    }
    redirectRestaurantFunc=(e)=>{
        this.setState({
            redirect:<Redirect to="/manageRest"/>
        })
    }
    redirectProfileFunc = (e)=>{
        this.setState({
            redirect:<Redirect to="/profileOwner"/>
        })
    }
    redirectOrders = (e)=>{
        this.setState({
           redirect:<Redirect to="/ordersOwner"/> 
        })
    }
    logout = (e)=>{
        e.preventDefault();
        cookie.remove('token');
        this.setState({
            redirect:<Redirect to="/" />
        })
    }
    goToMenu= (e) =>{
        console.log("ghghghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        this.setState({
            redirect:<Redirect to="/menuOwner" />
        })
    }
    render() {
        if(!cookie.load('token')){
            this.setState({
                redirect:<Redirect to="/ownerLogin" />
            })
        }
        
        return (
            <div>
                {this.state.redirect}
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#"><img height="40" width="100"src={process.env.PUBLIC_URL + '/grubhub.png'}/></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        
                        <div className="ui secondary pointing menu">
                            <a className="item nav-item active">
                            <Link to="/menuOwner">  <button className="nav-link" /* onClick={this.goToMenu} */>Menu <span className="sr-only">(current)</span></button></Link>
                            
                            </a>
                            <a className="item nav-item">
                            <Link to="/profileOwner"> <button className="nav-link" /* onClick={this.redirectProfileFunc} */ >Profile</button></Link>
                            
                            </a>
                            <a className="item nav-item">
                            <Link to="/ordersOwner"> <button className="nav-link" /* onClick={this.redirectOrders} */>Orders</button></Link>
                            
                            </a>
                            <a className="item nav-item">
                            <Link to="/manageRest"> <button className="nav-link"  /* onClick={this.redirectRestaurantFunc} */>Restaurant</button></Link>
                            
                            </a>
                            <div className="right menu">
                                <a onClick={this.logout} className="ui item nav-item">
                                Logout
                                </a>
                            </div>
                        </div>
                        
                    </div>
                    <div align="right" className="floatRight">Hello !  {this.props.signedInUser.owner_name} </div>
                </nav>
                
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    console.log('nav owner '+state);
    console.log(state);
    return {
        signedInUser:state.signedInUser
    }
}
export default connect(mapStateToProps)(NavOwner)
