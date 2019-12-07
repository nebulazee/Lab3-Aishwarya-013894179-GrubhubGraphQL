import React, { Component } from 'react'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import {connect} from 'react-redux' 
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { NavOwner } from '../NavOwner/NavOwner';

class HomeOwner extends Component {
    render() {
        var redirect = null;
        if (!cookie.load('token'))
            redirect = <Redirect to="/" />
        else 
            redirect = <Redirect to="/profileOwner"/>    
        return (
            <div>
                {redirect}
                {/* <NavOwner/> */}
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    console.log('---owner->'+state)
    console.log(state)
    return {
      signedInUser:state.signedInUser
    }
  }
export default connect(mapStateToProps)(HomeOwner)
