import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { serialize } from "react-serialize";

import settings from "../../settings";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";

// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import request from 'request'; 
import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

import { get } from "http";
const qs = require('querystring')

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      error_password: "",
      Inicio:true,

    };
    this.password = this.password.bind(this)
  
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  componentSendLogin = async (event) => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let usr_data = {
      "name": "login", "args": {
        "username": email,
        "password": password
      },
    }
    const requestBody = {
      "username": email,
      "password": password
    }
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    var url = settings.URL + "orders/login_user/";
    axios.post(url, JSON.stringify(requestBody), config)
      .then(function (response) {
          if (response.data) {
              //onSucess(response.data);
              localStorage.setItem("userdata", JSON.stringify(response.data));
              document.location.href = "/customer";

          };
      })
      .catch(function (error) {
          alert(error);

          console.log("otro", error);
      });
  };


  get_profile(){
    let rol = '';
    const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("access")
    }
    }
    axios.get(settings.URL_PROFILE, config)
    .then(function (response) {
      let role = response.data.role
      let id = response.data.concurso.id
      let tipoConcurso = response.data.concurso.code_type

      localStorage.setItem('dataUser',JSON.stringify(response.data))
      localStorage.setItem("role", role)
      localStorage.setItem("id", id)
      localStorage.setItem("code_type", tipoConcurso)
      localStorage.setItem("concurso_type", tipoConcurso)

      console.log(response)
      if(role === 'bussine'){
        document.location.href = "/FormBussinesBudget"
      }
      if(role === 'admin'){
        document.location.href = "/dashboard"   
      }
      if(role === 'personal'){ 
        document.location.href = "/FormPersonalBudget"  
       }
    })
    .catch((error) => {
      console.log("error", error.message);
  });
  }
  
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    this.timeOutFunction = setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  componentWillUnmount() {
  }

  handleChange = (e) => {
    alert(e);
  }
  password(e){
    this.setState({ Inicio:false})
    e.preventDefault()
  }
  preventDefault(){
    return false
  }
  render() {

    const { classes } = this.props;
    if(this.state.Inicio){
      return (
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form id="login_form">
                {/* <form onSubmit={event => this.componentSendLogin(event)}> */}
                <Card login className={classes[this.state.cardAnimaton]} button-default>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    style={{ backgroundColor: "#754ef9" }}
                  >
                    <h4 className={classes.cardTitle}>Log in</h4>
                    
                  </CardHeader>
                  <CardBody>
  
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="password"
  
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        )
                      }}
                    />
                    <div style={{color: 'red'}}>{this.state.error_password }</div>
                    <div>
                    </div>
                  </CardBody>
                  <CardFooter className={classes.justifyContentCenter}>
                    <Button onClick={this.componentSendLogin} style={{ backgroundColor: "#754ef9" }} simple size="lg" block>
                      Ingresar
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      );
    }if(!this.state.Inicio){
      return (
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form id="login_form">
                {/* <form onSubmit={event => this.componentSendLogin(event)}> */}
                <Card login className={classes[this.state.cardAnimaton]} button-default>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    style={{ backgroundColor: "#754ef9" }}
                  >
                    <h4 className={classes.cardTitle}>Log in</h4>
                    <div className={classes.socialLine}>
                      {[
                        "fab fa-facebook-square",
                        "fab fa-twitter",
                        "fab fa-google-plus"
                      ].map((prop, key) => {
                        return (
                          <Button
                            color="transparent"
                            justIcon
                            key={key}
                            className={classes.customButtonClass}
                          >
                            <i className={prop} />
                          </Button>
                        );
                      })}
                    </div>
                  </CardHeader>
                  <p style={{marginLeft:15,marginTop:10}}>Para recuperar su contrasena, porfavor ingrese su email.</p>
                  <CardBody>
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardBody>
                  <Button onClick={ () => { this.setState({Inicio:true})}} style={{ backgroundColor: "#754ef9" }} simple size="lg" block>
                      Enviar
                  </Button>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
    
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
