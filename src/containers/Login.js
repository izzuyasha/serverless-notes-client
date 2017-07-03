import React, { Component } from 'react';
import './Login.css';
import config from '../config.js';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { withRouter } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import {Button, Input, Row} from 'react-materialize';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  validateForm() {
    return this.state.username.length > 0
      && this.state.password.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

handleSubmit = async (event) => {
  event.preventDefault();

  this.setState({ isLoading: true });

  try {
    const userToken = await this.login(this.state.username, this.state.password);
    this.props.updateUserToken(userToken);
  }
  catch(e) {
    alert(e);
    this.setState({ isLoading: false });
  }
}

render() {
  return (
    <div className="Login">
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Input id="username" s={12} type="email" label="Email"
            onChange={this.handleChange} class="validate"/>
          <Input id="password" s={12} type="password" label="Password"
            onChange={this.handleChange} class="validate"/>
          <LoaderButton
            bsSize="large"
            disabled={ ! this.validateForm() }
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…" />
        </Row>
      </form>
    </div>
  );
}

  login(username, password) {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  const authenticationData = {
    Username: username,
    Password: password
  };

  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) => (
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
      onFailure: (err) => reject(err),
    })
  ));
}

}

export default withRouter(Login);
