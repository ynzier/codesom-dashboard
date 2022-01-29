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
  }, []);

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
            {!currentUser && history.push('/')}
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
        <RouteWithSidebar exact path={Routes.Home.path} page={Page.Home} />
        {/* Employee */}
        <RouteWithSidebar
          exact
          path={Routes.EmployeeList.path}
          page={Page.EmployeeList}
        />
        <RouteWithSidebar
          exact
          path={Routes.CreateNewEmployee.path}
          page={Page.CreateNewEmployee}
        />
        {/* User */}
        <RouteWithSidebar
          exact
          path={Routes.UserList.path}
          page={Page.UserList}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddPermission.path}
          page={Page.AddPermission}
        />
        <RouteWithSidebar exact path={Routes.Branch.path} page={Page.Branch} />
        <RouteWithSidebar
          exact
          path={Routes.AddBranch.path}
          page={Page.AddBranch}
        />
        <RouteWithSidebar
          exact
          path={Routes.getBranch.path}
          page={Page.GetBranch}
        />
        <Redirect to={Routes.NotFound.path} />
      </Switch>
    </>
  );
};
export default App;
