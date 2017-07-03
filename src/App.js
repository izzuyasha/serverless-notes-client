import React, { Component } from 'react';
import {
  withRouter
} from 'react-router-dom';
import './App.css';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from './config.js';
import AWS from 'aws-sdk';
import {Navbar, NavItem} from 'react-materialize';

class App extends Component {

constructor(props) {
  super(props);

this.state = {
  userToken: null,
  isLoadingUserToken: true,
};
}

updateUserToken = (userToken) => {
  this.setState({
    userToken: userToken
  });
}

handleNavLink = (event) => {
  event.preventDefault();
  this.props.history.push(event.currentTarget.getAttribute('href'));
}

handleLogout = (event) => {
  const currentUser = this.getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWS.config.credentials) {
	  AWS.config.credentials.clearCachedId();
	  }

  this.updateUserToken(null);
  this.props.history.push('/login');
}

render() {
  const childProps = {
    userToken: this.state.userToken,
    updateUserToken: this.updateUserToken,
  };

  return ! this.state.isLoadingUserToken
  &&
  (
    <div className="App container">
      <Navbar brand="Scribble" href='/' right>
        {this.state.userToken
        ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
        : [ <NavItem href="/signup">Signup</NavItem>,
            <NavItem href="/login">Login</NavItem>   ]}
      </Navbar>
      <Routes childProps={childProps} />
    </div>
  );
}

getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  return userPool.getCurrentUser();
}

getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
          reject(err);
          return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

async componentDidMount() {
  const currentUser = this.getCurrentUser();

  if (currentUser === null) {
    this.setState({isLoadingUserToken: false});
    return;
  }

  try {
    const userToken = await this.getUserToken(currentUser);
    this.updateUserToken(userToken);
  }
  catch(e) {
    alert(e);
  }

  this.setState({isLoadingUserToken: false});
}

}

export default withRouter(App);
