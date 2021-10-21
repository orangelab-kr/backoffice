import React from 'react';
import ReactDOM from 'react-dom';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { Dashboard, RequiredLogin } from './components';
import './index.css';
import {
  Admins,
  AdminsDetails,
  CouponGroups,
  CouponGroupsDetails,
  Helmets,
  HelmetsDetails,
  Kickboards,
  KickboardsDetails,
  Login,
  NotFound,
  PassPrograms,
  PermissionGroups,
  PermissionGroupsDetails,
  Platforms,
  PlatformsDetails,
  Services,
  ServicesDetails,
  Users,
  UsersDetails,
} from './pages';

ReactDOM.render(
  <div className="App">
    <RenderAfterNavermapsLoaded ncpClientId="nd1nqudj4x">
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            <Route path="/auth">
              <Switch>
                <Route path="/auth" exact>
                  <Redirect to="/auth/login" />
                </Route>
                <Route path="/auth/login" component={Login} />
              </Switch>
            </Route>
            <Route path="/">
              <RequiredLogin>
                <Dashboard>
                  <Switch>
                    <Route path="/" exact>
                      <Redirect to="/kickboards" />
                    </Route>
                    <Route path="/admins" exact>
                      <Admins />
                    </Route>
                    <Route path="/admins/:userId">
                      <AdminsDetails />
                    </Route>
                    <Route path="/users" exact>
                      <Users />
                    </Route>
                    <Route path="/users/:userId">
                      <UsersDetails />
                    </Route>
                    <Route path="/services" exact>
                      <Services />
                    </Route>
                    <Route path="/services/:serviceId">
                      <ServicesDetails />
                    </Route>
                    <Route path="/permissionGroups" exact>
                      <PermissionGroups />
                    </Route>
                    <Route path="/permissionGroups/:permissionGroupId">
                      <PermissionGroupsDetails />
                    </Route>
                    <Route path="/helmets" exact>
                      <Helmets />
                    </Route>
                    <Route path="/helmets/:helmetId">
                      <HelmetsDetails />
                    </Route>
                    <Route path="/passPrograms" exact>
                      <PassPrograms />
                    </Route>
                    <Route path="/couponGroups" exact>
                      <CouponGroups />
                    </Route>
                    <Route path="/couponGroups/:couponGroupId">
                      <CouponGroupsDetails />
                    </Route>
                    <Route path="/platforms" exact>
                      <Platforms />
                    </Route>
                    <Route path="/platforms/:platformId">
                      <PlatformsDetails />
                    </Route>
                    <Route path="/kickboards" exact>
                      <Kickboards />
                    </Route>
                    <Route path="/kickboards/:kickboardCode">
                      <KickboardsDetails />
                    </Route>
                  </Switch>
                </Dashboard>
              </RequiredLogin>
            </Route>
            <Route path="*" component={NotFound} />
          </Switch>
        </QueryParamProvider>
      </BrowserRouter>
    </RenderAfterNavermapsLoaded>
  </div>,
  document.getElementById('root')
);
