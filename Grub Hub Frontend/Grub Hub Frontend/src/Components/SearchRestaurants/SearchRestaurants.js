import React, { Component } from 'react'
import NavCustomer from '../NavCustomer/NavCustomer'
import Axios from 'axios'
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
  import {connect} from 'react-redux'
  import {Redirect} from 'react-router'
  import {restSelect} from'../../ItemAction'
  import {Link} from 'react-router-dom'
  import back1 from '../../../public/homeCust.jpg'
import cookie from 'react-cookies';

var sectionStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: `url(${back1})`
};
class SearchRestaurants extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             rests:[],
             redirect:"",
             searchString: ''
        }
        this.goToRestDetails=this.goToRestDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    goToRestDetails=(rest_id)=>{
        this.props.restSelect(rest_id);
        this.setState({
            redirect:<Redirect to="/RestDetailMenu"/>
        })
    }
    componentDidMount(){
        console.log("search "+this.props.itemSelected)
        Axios.get("http://localhost:3001/items/restsByItem?itemName="+this.props.itemSelected,{headers:{'Authorization':cookie.load('token')}})
        .then((response=>{
            console.log(response.data.restos);
            this.setState({
                rests:response.data.restos
            })
        }))
    }
    handleChange = (e) => {
        //  console.log(e.target.value);
        
        this.setState({
          searchString: e.target.value
        });
      }
      
    renderItem = rest => {
        // const { search } = this.state;
        // var code = country.item_desc.toLowerCase();
    
        return (
    
          <div className="col-md-3" style={{ marginTop: "20px" },sectionStyle}>
            <Card styles={{ card: { backgroundColor: "red" }}}>
            <Link to="/RestDetailMenu">
            <CardBody>
                          { 
                                <img align="left" width="180" height="80"
                                  src={"http://localhost:3001"+rest.rest_image}
                                  //className={"flag flag-" + code}
                                 
                                />
                              }
                          <CardTitle onClick={()=>this.goToRestDetails(rest.rest_id)} value={rest.rest_id} title={rest.rest_name}>
                           <br/><br/><br/>
                           {rest.rest_name}<br/>
                           {rest.cuisine}
                          </CardTitle>
                        </CardBody>
              </Link>
            </Card>
          </div>
        );
      };
    render() {
        var restaurants,
        restaurants = this.state.rests,
      searchString = this.state.searchString.trim().toLowerCase();

    if (searchString.length > 0) {
        restaurants = restaurants.filter(l => {
        return l.cuisine.toLowerCase().match(searchString);
      });
    }
        return (
            <div style={sectionStyle}>
                <NavCustomer/>
                {this.state.redirect}
                
                <br/>
                <div className="flyout">
                <div className="container">
                <Input style={{width:"1110px"}} placeholder="Choose among our cravings...."
                   type="search" value={this.state.searchString} onChange={this.handleChange}  aria-label="Search"
                />
                <br/>
                    <div class="row">
                        {

                            restaurants.map(l => {
                                return (
                                    this.renderItem(l)
                                    /* {/* <div key={l.item_id}>
                                        <div >{l.item_name}</div>
                                
                                    </div> } */
                                )
                            })}
                    </div>
                   {/*  {this.state.rests.map(rest=>{console.log(rest.rest_image)
                       return <Link to="/RestDetailMenu"><Card>
                        <CardBody>
                          { 
                                <img align="left" width="180" height="80"
                                  src={"http://localhost:3001"+rest.rest_image}
                                  //className={"flag flag-" + code}
                                 
                                />
                              }
                          <CardTitle onClick={()=>this.goToRestDetails(rest.rest_id)} value={rest.rest_id} title={rest.rest_name}>
                           Restaurant : {rest.rest_name}<br/>
                           Cuisine : {rest.cuisine}
                          </CardTitle>
                        </CardBody>
                      </Card></Link>
                    })
                    } */}
                </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>{
    console.log(state)
    return {
        signedInUser:state.signedInUser,
        itemSelected:state.itemSelected
    }
}
export default connect(mapStateToProps,{restSelect:restSelect})(SearchRestaurants)
