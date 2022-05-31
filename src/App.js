import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Routes } from 'routes';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import 'antd/dist/antd.min.css';
import './index.less';
import {
  AlertTemplate,
  ManagerSidebar,
  AdminSidebar,
  Navbar,
  Preloader,
} from 'components';
import AuthService from 'services/auth.service';
import * as Page from 'pages';

const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '10px',
  transition: transitions.FADE,
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  const [selectBranch, setSelectBranch] = useState(undefined);

  useEffect(async () => {
    const user = await AuthService.getCurrentUser();
    if (!currentUser && user) {
      setCurrentUser(user);
      if (user.authPayload.roleId == 1) setIsAdmin(true);
    }
    return () => {};
  }, []);
  useEffect(() => {
    if (selectBranch) localStorage.setItem('branchState', selectBranch);

    return () => {};
  }, [selectBranch]);

  const RouteWithLoader = ({ page: Component, ...rest }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setLoaded(true), 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <Route
        {...rest}
        render={props =>
          currentUser ? (
            <Redirect to={Routes.ReportSale.path} />
          ) : (
            <>
              <Preloader show={loaded ? false : true} />
              <Component {...props} />
            </>
          )
        }
      />
    );
  };
  const RouteWithSidebar = ({ page: Component, path, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          currentUser ? (
            isAdmin ? (
              <>
                <AdminSidebar />
                <main
                  className="content"
                  style={{
                    backgroundColor: 'rgba(249, 220, 194, 0.5)',
                    minHeight: '100vh',
                  }}>
                  <Navbar />
                  <Component />
                </main>
              </>
            ) : !adminRoute.includes(path) ? (
              <>
                <ManagerSidebar
                  selectBranch={selectBranch}
                  setSelectBranch={setSelectBranch}
                />

                <main
                  className="content"
                  style={{
                    backgroundColor: 'rgba(249, 220, 194, 0.5)',
                    minHeight: '100vh',
                  }}>
                  {selectBranch ? (
                    <>
                      <Navbar />
                      <Component {...props} selectBranch={selectBranch} />
                    </>
                  ) : (
                    <></>
                  )}
                </main>
              </>
            ) : (
              <Redirect to={Routes.NotFound.path} />
            )
          ) : (
            <Redirect to={Routes.Signin.path} />
          )
        }
      />
    );
  };

  const adminRoute = [
    Routes.CreateNewEmployee.path,
    Routes.GetEmployee.path,
    Routes.AddPermission.path,
    Routes.AddBranch.path,
    Routes.GetProduct.path,
    Routes.AddProduct.path,
  ];

  const [IsReady, SetIsReady] = useState(false);
  if (!IsReady) {
    setTimeout(() => {
      SetIsReady(true);
    }, 1000);
    return <Preloader show={!IsReady} />;
  } else
    return (
      <>
        <AlertProvider template={AlertTemplate} {...options}>
          <Switch>
            <Route path={Routes.NotFound.path} component={Page.NotFound} />
            <RouteWithLoader
              exact
              path={Routes.ServerError.path}
              page={Page.ServerError}
            />
            {/* deploy */}
            <RouteWithLoader exact path="/" page={Page.Login} />
            {/* Employee */}
            <RouteWithSidebar
              exact
              path={Routes.EmployeeList.path}
              page={Page.EmployeeList}
            />
            {/* User */}
            <RouteWithSidebar
              exact
              path={Routes.UserList.path}
              page={Page.UserList}
            />
            {/* Branch */}
            <RouteWithSidebar
              exact
              path={Routes.BranchLists.path}
              page={Page.BranchLists}
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
              path={Routes.CreateNewEmployee.path}
              page={Page.CreateNewEmployee}
            />
            <RouteWithSidebar
              exact
              path={Routes.GetEmployee.path}
              page={Page.GetEmployee}
            />
            <RouteWithSidebar
              exact
              path={Routes.AddPermission.path}
              page={Page.AddPermission}
            />
            <RouteWithSidebar
              exact
              path={Routes.AddBranch.path}
              page={Page.AddBranch}
            />
            <RouteWithSidebar
              exact
              path={Routes.AddProduct.path}
              page={Page.AddProduct}
            />
            <RouteWithSidebar
              exact
              path={Routes.AddPromotion.path}
              page={Page.AddPromotion}
            />
            <RouteWithSidebar
              exact
              path={Routes.GetProduct.path}
              page={Page.GetProduct}
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
              path={Routes.PromotionList.path}
              page={Page.PromotionList}
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
            <RouteWithSidebar
              exact
              path={Routes.ReportIngr.path}
              page={Page.ReportIngr}
            />
            <RouteWithSidebar
              exact
              path={Routes.DeliveryHistory.path}
              page={Page.DeliveryHistory}
            />
            <RouteWithSidebar
              exact
              path={Routes.ReportEmp.path}
              page={Page.ReportEmp}
            />
            <Redirect to={Routes.NotFound.path} />
          </Switch>
        </AlertProvider>
      </>
    );
};
export default App;
