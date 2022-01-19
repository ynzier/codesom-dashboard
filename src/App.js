import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { Routes } from 'routes';

// Components
import Sidebar from 'components/sidebar';
import Navbar from 'components/navbar';
import Preloader from 'components/preloader';

// Error Pages
import NotFoundPage from 'pages/errors/NotFound';
import ServerError from 'pages/errors/ServerError';
// Pages
import SignIn from 'pages/auth';
import AddItem from 'deploy/AddItem';
import AddAdmin from 'deploy/AddAdmin';
import AllAdmin from 'deploy/AdminList';
import AllCustomer from 'deploy/CustomerList';
import ProductList from 'deploy/ProductList';
import AuthService from 'services/auth.service';
import Setting from 'deploy/Setting';
import TransactionList from 'deploy/Receipts';
const App = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  let history = useHistory();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!currentUser && user) {
      setCurrentUser(user);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const RouteWithLoader = ({ component: Component, ...rest }) => {
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
  const RouteWithSidebar = ({ component: Component, ...rest }) => {
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
          component={NotFoundPage}
        />
        <RouteWithLoader
          exact
          path={Routes.ServerError.path}
          component={ServerError}
        />
        {/* deploy */}
        <RouteWithLoader exact path="/" component={SignIn} />
        <RouteWithSidebar
          exact
          path={Routes.ProductList.path}
          component={ProductList}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddItem.path}
          component={AddItem}
        />
        <RouteWithSidebar
          exact
          path={Routes.AddAdmin.path}
          component={AddAdmin}
        />
        <RouteWithSidebar
          exact
          path={Routes.AllAdmin.path}
          component={AllAdmin}
        />
        <RouteWithSidebar
          exact
          path={Routes.AllCustomer.path}
          component={AllCustomer}
        />
        <RouteWithSidebar
          exact
          path={Routes.Setting.path}
          component={Setting}
        />
        <RouteWithSidebar
          exact
          path={Routes.Setting.path}
          component={Setting}
        />
        <RouteWithSidebar
          exact
          path={Routes.TransactionList.path}
          component={TransactionList}
        />
        <Redirect to={Routes.NotFound.path} />
      </Switch>
    </>
  );
};
export default App;
