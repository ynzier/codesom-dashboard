import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { Routes } from 'routes';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import { AlertTemplate } from 'components';

// Components
import { Sidebar, Navbar, Preloader } from 'components';
import './index.css';
import AuthService from 'services/auth.service';

// Error Pages
import * as Page from 'pages';

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '10px',
  // you can also just use 'scale'
  transition: transitions.FADE,
};

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
            <Preloader show={loaded ? false : true} />

            <Component {...props} />
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
                backgroundColor: 'rgba(249, 220, 194, 0.5)',
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
      <AlertProvider template={AlertTemplate} {...options}>
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
            path={Routes.GetEmployee.path}
            page={Page.GetEmployee}
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
          {/* Branch */}
          <RouteWithSidebar
            exact
            path={Routes.BranchLists.path}
            page={Page.BranchLists}
          />
          <RouteWithSidebar
            exact
            path={Routes.AddBranch.path}
            page={Page.AddBranch}
          />
          <RouteWithSidebar
            exact
            path={Routes.GetBranch.path}
            page={Page.GetBranch}
          />
          <RouteWithSidebar
            exact
            path={Routes.CreateRequisition.path}
            page={Page.CreateRequisition}
          />
          <RouteWithSidebar
            exact
            path={Routes.BranchWarehouse.path}
            page={Page.BranchWarehouse}
          />
          <RouteWithSidebar
            exact
            path={Routes.RequisitionList.path}
            page={Page.RequisitionList}
          />
          <RouteWithSidebar
            exact
            path={Routes.GetRequisition.path}
            page={Page.GetRequisition}
          />
          <RouteWithSidebar
            exact
            path={Routes.ProductList.path}
            page={Page.ProductList}
          />
          <RouteWithSidebar
            exact
            path={Routes.IngrAndStuffList.path}
            page={Page.IngrAndStuffList}
          />
          <RouteWithSidebar
            exact
            path={Routes.AddProduct.path}
            page={Page.AddProduct}
          />
          <RouteWithSidebar
            exact
            path={Routes.GetProduct.path}
            page={Page.GetProduct}
          />
          <RouteWithSidebar
            exact
            path={Routes.PromotionList.path}
            page={Page.PromotionList}
          />
          <RouteWithSidebar
            exact
            path={Routes.AddPromotion.path}
            page={Page.AddPromotion}
          />
          <RouteWithSidebar
            exact
            path={Routes.GetPromotion.path}
            page={Page.GetPromotion}
          />
          <RouteWithSidebar
            exact
            path={Routes.OrderHistory.path}
            page={Page.OrderHistory}
          />
          <RouteWithSidebar
            exact
            path={Routes.GetOrder.path}
            page={Page.GetOrder}
          />
          <RouteWithSidebar
            exact
            path={Routes.ReportSale.path}
            page={Page.ReportSale}
          />
          <Redirect to={Routes.NotFound.path} />
        </Switch>
      </AlertProvider>
    </>
  );
};
export default App;
