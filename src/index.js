import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin.jsx";
import LoginViewPage from "views/Pages/LoginPage.jsx"

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
      <Route path="/admin/loginuser" component={LoginViewPage} />
      <Route path="/admin" component={AdminLayout} />


      <Redirect from="/" to="/admin/home" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
