import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Main from './Components/Main'
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
/* import 'bootstrap/dist/css/bootstrap.min.css'; */
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphQL'
});
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
      <div className="App">
        {/* <Navbaar/>
        <Login/>
        <Test/> */}
        <BrowserRouter>
          <Main/>
        </BrowserRouter>
      </div>
      </ApolloProvider>
    );
  }
}

export default App;
