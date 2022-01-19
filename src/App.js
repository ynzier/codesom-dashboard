import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { Routes } from 'routes';

// Components
import { Sidebar, Navbar, Preloader } from 'components';

import AuthService from 'services/auth.service';

// Error Pages
import * as Page from 'pages';

const App = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let history = useHistory();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!currentUser && user) {
      setCurrentUser(user);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const RouteWithLoader = ({ page: Component, ...rest }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setLoaded(true), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <Route
        {...rest}
        render={props => (
          <>
            {currentUser && history.push('/dashboard')}
            <Preloader show={loaded ? false : true} /> <Component {...props} />
          </>
        )}
      />
    );
  };
  const RouteWithSidebar = ({ page: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props => (
          <>
            {currentUser && history.push('/')}
            <Sidebar />

            <main
              className="content"
              style={{
                backgroundColor: 'rgba(255, 233, 212, 0.5)',
                minHeight: '100vh',
              }}>
              <Navbar />
              <Component {...props} />
            </main>
          </>
        )}
      />
    );
  };

  return (
    <>
      <Switch>
        <RouteWithLoader
          exact
          path={Routes.NotFound.path}
          page={Page.NotFound}
        />
        <RouteWithLoader
          exact
          path={Routes.ServerError.path}
          page={Page.ServerError}
        />
        {/* deploy */}
        <RouteWithLoader exact path="/" page={Page.Login} />
        <RouteWithSidebar
          exact
          path={Routes.ProductList.path}
          page={Page.ProductList}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddItem.path}
          page={Page.AddItem}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddAdmin.path}
          page={Page.AddAdmin}
        />
        <RouteWithSidebar
          exact
          path={Routes.AdminList.path}
          page={Page.AdminList}
        />
        <RouteWithSidebar
          exact
          path={Routes.CustomerList.path}
          page={Page.CustomerList}
        />
        <RouteWithSidebar
          exact
          path={Routes.Setting.path}
          page={Page.Setting}
        />
        <RouteWithSidebar
          exact
          path={Routes.Setting.path}
          page={Page.Setting}
        />
        <RouteWithSidebar
          exact
          path={Routes.Receipts.path}
          page={Page.Receipts}
        />
        <Redirect to={Routes.NotFound.path} />
      </Switch>
    </>
  );
};
export default App;
