import React, { Component } from 'react'
import Navbaar from './Navbar/Navbaar'
import {Route} from 'react-router-dom';
import {Router} from 'react-router'
import CustomerSignUp from './CustomerSignUp/CustomerSignUp';

import OwnerLogin from './OwnerLogin/OwnerLogin'
import OwnerSignUp from './OwnerSignUp/OwnerSignUp'
import CustomerLogin from './CustomerLogin/CustomerLogin'

import HomeCustomer from '../Components/HomeCustomer/HomeCustomer'
import HomeOwner from '../Components/HomeOwner/HomeOwner'
import ProfileCustomer from '../Components/ProfileCustomer/ProfileCustomer'
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import Reducers from '../Reducers/index'
import ProfileOwner from './ProfileOwner/ProfileOwner'
import ManageRestaurant from './ManageRestaurant/ManageRestaurant'
import MenuOwner from './MenuOwner/MenuOwner'
import SearchRestaurants from './SearchRestaurants/SearchRestaurants'
import RestDetailMenu from '../RestDetailMenu/RestDetailMenu';
import CustomerOrders from '../Components/CustomerOrders/CustomerOrders'
import OwnerOrders from './OwnerOrders/OwnerOrders';
import CustomerCart from './CustomerCart/CustomerCart'
//const BrowserHistory = require('react-router/lib/BrowserHistory').default;
class Main extends Component {
    render() {
        return (
            <div>
                 
            {/*Render Different Component based on Route*/}
            <Route exact path="/" component={Navbaar}/>
            <Route path="/customerLogin" component={CustomerLogin}/>
            <Route path="/ownerLogin" component={OwnerLogin}/>
            <Route path="/customerSignUp" component={CustomerSignUp}/>
            <Route path="/ownerSignUp" component={OwnerSignUp}/>
            <Route path="/homeOwner" component={HomeOwner}/>
            <Route path="/homeCustomer" component={HomeCustomer}/>
            <Route path="/menuOwner" component={MenuOwner}/>
            
            <Route path="/profileCustomer" component={ProfileCustomer}/>
            <Route path="/profileOwner" component={ProfileOwner}/>
            <Route path="/manageRest" component={ManageRestaurant}/>

            <Route path="/searchRestaurantsPage" component={SearchRestaurants}/>
            <Route path="/RestDetailMenu" component={RestDetailMenu}/>

            <Route path="/orderCustomer" component={CustomerOrders}/>
            <Route path="/ordersOwner" component={OwnerOrders}/>

            <Route path="/custCart" component={CustomerCart}/>
            
         

           {/*  <Route path="/delete" component={Delete}/>
            <Route path="/create" component={Create}/>  */}
           
        </div>
        )
    }
}

export default Main
