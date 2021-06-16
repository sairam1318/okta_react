import React from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import Home from './Home';
import Login from './Login';
import Protected from './Protected';
import { oktaAuthConfig, oktaSignInConfig } from './Config';

const oktaAuth = new OktaAuth(oktaAuthConfig);

const AppWithRouterAccess = () => {
  const history = useHistory();

  const customAuthHandler = () => {
    history.push('/login');
  };
  
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    console.log(window.location.origin);
    console.log(originalUri);
    history.replace(toRelativeUrl(originalUri, window.location.origin + "/"));
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      //imported from Config.js
      onAuthRequired={customAuthHandler}
      //if the url is some thing diferent, it will be pused to login
      restoreOriginalUri={restoreOriginalUri}
      //replace the past uri with new
    >
      <Switch>
        <Route path='/' exact={true} component={Home} />
        <SecureRoute path='/protected' component={Protected} />
        {/* Only logged in users can have access */}
        <Route path='/login' render={() => <Login config={oktaSignInConfig} />} />
        {/* login has render as it has props, and as a config sending the Base url */}
        <Route path='/login/callback' component={LoginCallback} />
      </Switch>
    </Security>
  );
};
export default AppWithRouterAccess;
