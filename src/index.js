import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.jsx";
import LoginViewPage from "views/Pages/LoginPage.jsx"
import CustomerViewPage from "views/Components/GenericServlet"

import "assets/scss/material-dashboard-pro-react.scss?v=1.5.0";
import "assets/css/bootstrap.min.css";
import "assets/css/LineIcons.css";

import "assets/css/magnific-popup.css";
import "assets/css/default.css";
import "assets/css/style.css";



const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/loginuser" component={LoginViewPage} />
      <Route path="/customer" component={AdminLayout} />
      <Route path="/order" component={AdminLayout} />
      <Route path="/new-order" component={AdminLayout} />

      <Route path="/color" component={AdminLayout} />
      <Route path="/chain" component={AdminLayout} />
      <Route path="/plinth" component={AdminLayout} />
      <Route path="/drop" component={AdminLayout} />
      <Route path="/cloth" component={AdminLayout} />
      <Route path="/source" component={AdminLayout} />

      <Redirect from="/" to="/customer" />

      

    </Switch>
  </Router>,
  document.getElementById("root")
);
