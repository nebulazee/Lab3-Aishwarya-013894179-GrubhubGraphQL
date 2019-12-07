import React, { Component } from 'react'
import NavOwner from '../NavOwner/NavOwner'
import { connect } from 'react-redux'
import Axios from 'axios'
import { signInUser } from '../../Action/index'
import back1 from '../../../public/homeCust.jpg'
import cookie from 'react-cookies'
var sectionStyle = {
  width: "100%",
  height: "550px",
  backgroundImage: `url(${back1})`
};
class ManageRestaurant extends Component {

    constructor(props) {
        super(props)

        this.state = {
            rest_name: this.props.signedInUser.rest_name,
            rest_address: this.props.signedInUser.rest_address,
            rest_contact: this.props.signedInUser.rest_contact,
            image: "http://localhost:3001" + this.props.signedInUser.rest_image,
            rest_zip: this.props.signedInUser.rest_zip,
            cuisine: this.props.signedInUser.cuisine
            /*  restaurant:this.props.signedInUser.re */
        }
        this.updateRestaurant = this.updateRestaurant.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
        this.imagehandler = this.imagehandler.bind(this);

        this.contacthandler = this.contacthandler.bind(this);
        this.namehandler = this.namehandler.bind(this);
        this.ziphandler = this.ziphandler.bind(this);
        this.addresshandler = this.addresshandler.bind(this);
        this.cuisinehandler = this.cuisinehandler.bind(this);
        //this.restauranthandler=this.restauranthandler.bind(this); 
    }
    /* updateRestaurant=(e)=>{
        e.preventdefault();
        Axios.post('http://localhost:3001/')
        .then()
    } */
    namehandler = (e) => {
        this.setState({
            rest_name: e.target.value
        })
    }

    contacthandler = (e) => {
        this.setState({
            rest_contact: e.target.value
        })
    }
    cuisinehandler = (e) => {
        this.setState({
            cuisine: e.target.value
        })
    }
    addresshandler = (e) => {
        this.setState({
            rest_address: e.target.value
        })
    }
    ziphandler = (e) => {
        this.setState({
            rest_zip: e.target.value
        })
    }
    imagehandler = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    }
    updateRestaurant = (e) => {
        const data = {
            rest_id: this.props.signedInUser.rest_id,
            rest_name: this.state.rest_name,
            rest_contact: this.state.rest_contact,
            rest_address: this.state.rest_address,
            rest_zip: this.state.rest_zip,
            cuisine: this.state.cuisine

        }
        Axios.post("http://localhost:3001/details/updateRestaurant", data,{headers:{'Authorization':cookie.load('token')}})
            .then((response) => {
                console.log(response.data.rest[0])
                const newRest = response.data.rest[0];
                let owner = {
                    owner_id: this.props.signedInUser.owner_id,
                    owner_name: this.props.signedInUser.owner_name,
                    owner_image: this.props.signedInUser.owner_image,
                    owner_contactNumber: this.props.signedInUser.owner_contactNumber,
                    owner_email: this.props.signedInUser.owner_email,
                    rest_id: this.props.signedInUser.rest_id,
                    rest_name: newRest.rest_name,
                    rest_address: newRest.rest_address,
                    rest_zip: newRest.rest_zip,
                    rest_contact: newRest.rest_contact,
                    cuisine: newRest.cuisine,
                    rest_image:newRest.rest_image
                }
                this.setState({
                    rest_name: newRest.rest_name,
                    rest_address: newRest.rest_address,
                    rest_zip: newRest.rest_zip,
                    rest_contact: newRest.rest_contact,
                    cuisine: newRest.cuisine
                })
                this.props.signInUser(owner);
            })
    }
    addPhoto = (e) => {

        //e.preventDefault();
        const data = new FormData();
        data.append('rest_id', this.props.signedInUser.rest_id);
        data.append('rest_image', this.state.image);
        data.append('rest_name', this.state.rest_name);
        console.log(data);

        const headers = {
            'content-type': 'multipart/form-data',
            'Authorization':cookie.load('token')
        }
        console.log(data.rest_image)
        Axios.post('http://localhost:3001/details/addRestaurantPhoto', data, { headers })
            .then((response) => {
                console.log(response);
                this.setState({
                    image: "http://localhost:3001" + response.data.rest[0].rest_image
                })
                //change reducers also
                console.log("image-----" + this.state.image)
                const newRest = response.data.rest[0];
                let owner = {
                    owner_id: this.props.signedInUser.owner_id,
                    owner_name: this.props.signedInUser.owner_name,
                    owner_image: this.props.signedInUser.owner_image,
                    owner_contactNumber: this.props.signedInUser.owner_contactNumber,
                    owner_email: this.props.signedInUser.owner_email,
                    rest_id: this.props.signedInUser.rest_id,
                    rest_name: newRest.rest_name,
                    rest_address: newRest.rest_address,
                    rest_zip: newRest.rest_zip,
                    rest_contact: newRest.rest_contact,
                    cuisine: newRest.cuisine,
                    rest_image: newRest.rest_image
                }
                this.props.signInUser(owner);
            })
    }

    render() {
        return (
            <div style={sectionStyle}>
                <NavOwner />
                <div className="container">
                <br/>
                    <div class="table-responsive">
                    <table class="table table bg-white"   border="0">
                        <tr>
                        <td rowspan="4"> <img src={this.state.image} height="200" width="250" alt="" className="img-rounded img-responsive" /></td>
                            <th>Restaurant:</th>
                            <td> <input type="text" onChange={this.namehandler} value={this.state.rest_name} class="form-control" name="name" /></td>
                        </tr>
                        <tr>
                           
                            <th>Address:</th>
                            <td><input type="text" onChange={this.addresshandler} value={this.state.rest_address} class="form-control" name="contact" /></td>
                           
                          
                        </tr>
                        <tr>
                           
                            <th>Zip:</th>
                            <td> <input type="text" onChange={this.ziphandler} value={this.state.rest_zip} class="form-control" name="contact" /></td>
                           
                          
                        </tr>
                        <tr>
                           
                            <th>Cuisine:</th>
                            <td> <input type="text" onChange={this.cuisinehandler} value={this.state.cuisine} class="form-control" name="contact" /></td>
                           
                          
                        </tr>
                        <tr>
                            <td align="center"><form  enctype="multipart/form-data" method="POST">
                                <input type="file" onChange={this.imagehandler} name="rest_image" accept="image/*" />
                               
                            </form></td>
                            <th>Contact</th>
                            <td><input type="text" onChange={this.contacthandler} class="form-control" value={this.state.rest_contact} name="contact" /></td>
                        </tr>
                        <tr >
                            <td colspan="2">
                            <input type="button" onClick={this.addPhoto} class="btn btn-primary " value="Upload Photo" />
                            </td>
                            <td>
                            <button type="button" onClick={this.updateRestaurant} class="btn btn-primary">Update</button>
                            </td>
                        </tr>
                    </table>
                    </div>
                    {/* <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6">
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <img src={this.state.image} height="150" width="150" alt="" className="img-rounded img-responsive" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <form enctype="multipart/form-data" method="POST">
                                        <input type="file" onChange={this.imagehandler} name="rest_image" accept="image/*" />
                                        <input type="button" onClick={this.addPhoto} value="Upload Photo" />
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6">
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <label for="name" >Restaurant Name :{this.state.rest_name}</label>
                                    <input type="text" onChange={this.namehandler} class="form-control" name="name" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <label for="email" >Restaurant Contact :{this.state.rest_contact}</label>
                                    <input type="email" onChange={this.contacthandler} class="form-control" name="email" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <label for="contact" >Restaurant Zip :{this.state.rest_zip}</label>
                                    <input type="text" onChange={this.ziphandler} class="form-control" name="contact" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <label for="contact" >Restaurant Address :{this.state.rest_address}</label>
                                    <input type="text" onChange={this.addresshandler} class="form-control" name="contact" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <label for="contact" >Restaurant Cuisine :{this.state.cuisine}</label>
                                    <input type="text" onChange={this.cuisinehandler} class="form-control" name="contact" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6 col-md-4">
                                    <button type="button" onClick={this.updateRestaurant} class="btn btn-primary">Update</button>
                                </div>
                            </div>
                        </div>

                    </div> */}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    console.log('profile owner state in manage rest ' + state);
    console.log(JSON.stringify(state))
    return {
        signedInUser: state.signedInUser
    };
}
export default connect(mapStateToProps, { signInUser: signInUser })(ManageRestaurant)
