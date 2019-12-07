import React, { Component } from 'react'
import {connect} from 'react-redux' 
import {signInUser} from '../../Action'
import {deleteCart} from '../../ItemAction'
import {deletePrice} from '../../ItemAction'
import {Redirect} from 'react-router'
import cookie from 'react-cookies'
import {Link} from 'react-router-dom'
class NavCustomer extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             redirect:"",
             loggedInUser:this.props.signedInUser
        }
    this.redirectProfileFunc=this.redirectProfileFunc.bind(this);
    this.logout=this.logout.bind(this);
    this.migrateHome=this.migrateHome.bind(this);
    localStorage.setItem("loggedInUser",this.state.loggedInUser)
        
    }
  /*   componentDidUpdate(){
        this.setState({
            loggedInUser:this.props.signedInUser
        })
    } */
    /* componentDidMount(){
        this.setState({
            loggedInUser:this.props.signedInUser
        })
        if(this.state.loggedInUser!=="")
        sessionStorage.setItem('loggedInUser',this.state.loggedInUser)
        console.log("state loggedinuser"+this.state.loggedInUser)
        console.log("sess"+sessionStorage.getItem('loggedInUser'))
    } */
    redirectOrdersPage = (e)=>{
        this.setState({
            redirect:<Redirect to="/orderCustomer"/>
        })
    }
    redirectProfileFunc = (e)=>{
        this.setState({
            redirect:<Redirect to="/profileCustomer"/>
        })
    }
    logout = (e)=>{
        e.preventDefault();
        cookie.remove('token');
        this.props.deleteCart();
        this.props.deletePrice();
        this.setState({
            redirect:<Redirect to="/" />
        })
    }
    migrateHome= () =>{
        this.setState({
            redirect:<Redirect to="/homeCustomer" />
        })
    }
    render() {
        if(!cookie.load('token')){
            this.setState({
                redirect: <Redirect to="/customerLogin" />
            })
        }
           
        return (
            <div>
                {this.state.redirect}
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#"><img height="40" width="100"src={process.env.PUBLIC_URL + '/grubhub.png'}/></a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                               <Link to="/homeCustomer"> <button class="nav-link" /* onClick={this.migrateHome} */>Home <span class="sr-only">(current)</span></button></Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/profileCustomer"><button class="nav-link" /* onClick={this.redirectProfileFunc} */ >Profile</button></Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/orderCustomer"><button class="nav-link" /* onClick={this.redirectOrdersPage} */ >Orders</button></Link>
                            </li>
                            <li class="nav-item">
                                {/* <Link to="/custCart"><button class="btn btn-danger my-cart-btn" >Cart</button></Link> */}
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" onClick={this.logout} tabindex="-1" >Logout</button>
                            </li>
                        </ul>
                    </div>
                    <span align="right">Hello ! {this.props.signedInUser.customer_name}</span>
                    <Link to="/custCart"><button class="btn btn-danger my-cart-btn" /* onClick={this.redirectOrdersPage} */ ><img class="img img-responsive center-block" width="20" height="20"src={process.env.PUBLIC_URL + '/cart.png'}/>{" "+this.props.itemsInCart.items.length}</button></Link>
                   
                </nav>
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    console.log('nav customer '+state);
    console.log(state);
    return {
        signedInUser:state.signedInUser,
        price:state.price,
        itemsInCart:state.itemsInCart
    }
}
export default connect(mapStateToProps,{deleteCart:deleteCart,deletePrice:deletePrice})(NavCustomer)
