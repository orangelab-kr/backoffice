import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { Dashboard, RequiredLogin } from './components';
import './index.css';
import {
  Admins,
  AdminsDetails,
  Collectors,
  CollectorsDetails,
  CouponGroups,
  CouponGroupsDetails,
  Helmets,
  HelmetsDetails,
  Kickboards,
  KickboardsDetails,
  Login,
  Monitoring,
  NotFound,
  PassPrograms,
  PassProgramsDetails,
  PermissionGroups,
  PermissionGroupsDetails,
  Platforms,
  PlatformsDetails,
  Pricings,
  PricingsDetails,
  Profiles,
  ProfilesDetails,
  Regions,
  RegionsDetails,
  Rides,
  RidesDetails,
  Services,
  ServicesDetails,
  Users,
  UsersDetails,
} from './pages';

ReactDOM.render(
  <div className="App">
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
                  <Route path="/monitoring">
                    <Monitoring />
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
                  <Route path="/collectors" exact>
                    <Collectors />
                  </Route>
                  <Route path="/collectors/:userId">
                    <CollectorsDetails />
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
                  <Route path="/passPrograms/:passProgramId">
                    <PassProgramsDetails />
                  </Route>
                  <Route path="/couponGroups" exact>
                    <CouponGroups />
                  </Route>
                  <Route path="/couponGroups/:couponGroupId">
                    <CouponGroupsDetails />
                  </Route>
                  <Route path="/rides" exact>
                    <Rides />
                  </Route>
                  <Route path="/rides/:rideId">
                    <RidesDetails />
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
                  <Route path="/pricings" exact>
                    <Pricings />
                  </Route>
                  <Route path="/pricings/:pricingId">
                    <PricingsDetails />
                  </Route>
                  <Route path="/regions" exact>
                    <Regions />
                  </Route>
                  <Route path="/regions/:regionId">
                    <RegionsDetails />
                  </Route>
                  <Route path="/profiles" exact>
                    <Profiles />
                  </Route>
                  <Route path="/profiles/:profileId">
                    <ProfilesDetails />
                  </Route>
                </Switch>
              </Dashboard>
            </RequiredLogin>
          </Route>
          <Route path="*" component={NotFound} />
        </Switch>
      </QueryParamProvider>
    </BrowserRouter>
  </div>,
  document.getElementById('root')
);
