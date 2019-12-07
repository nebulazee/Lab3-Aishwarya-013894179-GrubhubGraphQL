import React, { Component } from 'react'
import ReactBootstrap from 'react-bootstrap'
import FormControl from 'react-bootstrap/FormControl'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'
import UnloggedHome from '../Unlogged/UnloggedHome'
import { Redirect } from 'react-router'
import axios from 'axios'

class Navbaar extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }

  }
  handleLogout = () => {
    //axios.defaults.withCredentials = true;
   // axios.get('http://localhost:3001/logout').then((response) => {
     console.log("removed token");
      cookie.remove('token', { path: '/' })
      //  console.log(response.data);
   // });

  }

  render() {

    /* let RedirectVar = null;
    if (!cookie.load('token')) {
      console.log(cookie.load('token'))
      RedirectVar = <Redirect to="/" />/*{/* <UnloggedHome /> }
    } */
    
     let navLogin = null;
    if (cookie.load('token')) {

      //Logout = <ul className="nav navbar-nav navbar-right"><li className="nav-item"><Link to="/" onClick={this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li></ul>
      navLogin=<li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           {/*  <Link to="/" onClick={this.handleLogout}> */}Logout{/* </Link> */}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          {/* <a className="dropdown-item" href="/">Logout</a> */}
          <Link to="/" className="dropdown-item" onClick={this.handleLogout}>Logout</Link>
          
        </div>
            </li>
    } else {
      navLogin = <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Login
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="/customerLogin">Customer Login</a>
          <a className="dropdown-item" href="/ownerLogin">Owner Login</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="/customerSignUp">Customer Sign Up</a>
          <a className="dropdown-item" href="/ownerSignUp">Owner Sign Up</a>
        </div>
      </li>
    }
    return (
      <div >
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#"><img height="40" width="100"src={process.env.PUBLIC_URL + '/grubhub.png'}/></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>

              {navLogin}
             {/*  <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Login
               </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/customerLogin">Customer Login</a>
                  <a className="dropdown-item" href="/ownerLogin">Owner Login</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="/customerSignUp">Customer Sign Up</a>
                  <a className="dropdown-item" href="/ownerSignUp">Owner Sign Up</a>
                </div>
              </li> */}



           {/*    {Logout} */}
            </ul>
            
          </div>
        </nav>
        {/* {RedirectVar} */}
        
      </div>
    )
  }
}

export default Navbaar
