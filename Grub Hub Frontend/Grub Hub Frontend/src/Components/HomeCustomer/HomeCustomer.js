import React, { Component } from 'react'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { connect } from 'react-redux'
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Axios from 'axios'
import NavCustomer from '../NavCustomer/NavCustomer'
import {Link} from 'react-router-dom'

import {
  Button,
  Input,
  Footer,
  Card,
  CardBody,
  CardImage,
  CardTitle,
  CardText
} from "mdbreact";
import cookie from 'react-cookies';
import { Redirect } from 'react-router'
import Navbaar from '../Navbar/Navbaar';
import {itemSelect} from '../../ItemAction'
import back1 from '../../../public/homeCust.jpg'

var sectionStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: `url(${back1})`
};

class HomeCustomer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      searchString: '',
      loggedInUser: this.props.signedInUser,
      redirect:"",
      numList:[],
      itemsSubPageList:[]
    }
    this.handleChange = this.handleChange.bind(this);
    this.goToRelatedRest = this.goToRelatedRest.bind(this);
  }
  goToRelatedRest = (item) => {
    console.log('related restos')
    console.log(item)
    this.props.itemSelect(item)
    this.setState({
      redirect:<Redirect to="/searchRestaurantsPage"/>
    })
  }
  setSublist = (page)=>{
    let tempList=null;
    if(page!=null)
    tempList=this.state.items.slice(page.start,page.end)
    this.setState({
        itemsSubPageList:tempList
    })
}
  handleChange = (e) => {
    //  console.log(e.target.value);
    
    this.setState({
      searchString: e.target.value
    });
  }
  componentDidMount() {
    Axios.defaults.withCredentials = true;
    Axios.get('http://localhost:3001/items/allItems',{headers:{'Authorization':cookie.load('token')}}).then((response) => {
      console.log(typeof (response));
      console.log('dfdfdfdfff')
      console.log(response.data)

      this.setState({
        items: response.data.items
      })
      var pages=this.state.items.length/8;
      var numberList=[];let c=1;
      console.log(pages+" and " +this.state.items.length)
      if(Math.floor(pages)*8<this.state.items.length)
        pages=pages+1;
        var tempList=null;
        tempList = this.state.items.slice(0, 8)
        this.setState({
          itemsSubPageList: tempList
        })
      for(let i=1;i<=pages;i++){
          let page_no = c;
          let start=(page_no-1)*8;
          const numdata = {
              page_no:c,
              start:(page_no-1)*8,
              end:start+8
          }
          console.log(numdata)
          c++;
          numberList.push(numdata);
      }
      this.setState({
          numList:numberList
      })

    })


  }
  renderItem = item => {
    // const { search } = this.state;
    // var code = country.item_desc.toLowerCase();

    return (

      <div className="col-md-3" style={{ marginTop: "20px" }}>
        <Card styles={{ card: { backgroundColor: "red" }}}>
        <Link to="/searchRestaurantsPage">
          <CardBody >
            { <p className="">
                  <img
                    src={item.item_image}
                    /* className={"flag flag-" + code} */
                    height="80"
                    width="80"
                  />
                </p> }
            <CardTitle onClick={()=>this.goToRelatedRest(item.item_name)} value={item.item_name} title={item.item_name}>
              
              {item.item_name.substring(0, 15)}
              {item.item_name.length > 15 && "..."}
            </CardTitle>
          </CardBody>
          </Link>
        </Card>
      </div>
    );
  };
  render() {

    if(!cookie.load('token')){
      this.setState({
        redirect:<Redirect to="/customerLogin"/>
      })
    }
    var foodItems,
      foodItems = this.state.itemsSubPageList,
      searchString = this.state.searchString.trim().toLowerCase();

    if (searchString.length > 0) {
      foodItems = foodItems.filter(l => {
        return l.item_name.toLowerCase().match(searchString);
      });
    }
    /* var redirect = null;
    if (!cookie.load('token'))
      redirect = <Redirect to="/customerLogin" /> */
    return (

      <div style={sectionStyle}>


        {this.state.redirect}
        <NavCustomer />
        
        <div className="flyout">

          {/* <main style={{ marginTop: "4rem" }}> */}
          <div className="container">
            
            <div className="row">
              <div className="col-12">
                <center>
                  {/*  */}

               

                  {/*  */}
                </center>
              </div>
              
              <div className="col">
                <Input style={{width:"1110px"}} placeholder="Choose among our cravings...."
                   type="search" value={this.state.searchString} onChange={this.handleChange}  aria-label="Search"
                />
                <nav aria-label="pagination">
                    <ul class="pagination justify-content-end">
                        {this.state.numList.map(page => {
                            return <li class="page-item" ><button onClick={()=>this.setSublist(page)} class="page-link">{page.page_no}</button></li>
                        })}
                    </ul>
                </nav>
              </div>
              <div className="col" />
            </div>
            <br></br>
            <div className="row">
              {

                foodItems.map(l => {
                  return (
                    this.renderItem(l)
                    /* {/* <div key={l.item_id}>
                        <div >{l.item_name}</div>

                    </div> } */
                  )
                })}
            </div>
          </div>
          {/* </main> */}
          {/*  <Footer color="indigo">
             <p className="footer-copyright mb-0">
               &copy; {new Date().getFullYear()} Copyright
             </p>
           </Footer> */}
        </div>
        
      </div>


    )
  }
}
const mapStateToProps = (state) => {
  console.log('---->' + state)
  console.log(state)
  return {
    signedInUser: state.signedInUser
  }
}
export default connect(mapStateToProps,{itemSelect:itemSelect})(HomeCustomer)
