import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/Schedule";
import Info from "@material-ui/icons/Info";
import LocationOn from "@material-ui/icons/LocationOn";
import Gavel from "@material-ui/icons/Gavel";
import HelpOutline from "@material-ui/icons/HelpOutline";
import settings from "settings";
import Button from 'components/CustomButtons/Button';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import CardIcon from 'components/Card/CardIcon';
import EditIcon from '@material-ui/icons/Edit';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import CustomInput from "components/CustomInput/CustomInput.jsx";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Accordion from "components/Accordion/Accordion.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import axios from "axios";
import CustomDialog from "components/CustomDialog"
import CustomTable from './CustomTable.jsx'
import Swal from 'sweetalert2'
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import Table from "components/Table/Table.jsx";

const styles = {
  cardTitle,
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  },
  cardCategory: {
    margin: "0",
    color: "#999999"
  }
};


class GenericServlet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      screen: "",
      results: [],
      headers: [],
      open: false,
      data: {},
      showHistory: false,
      boxs: [],
      edit_screen: {},
    };
  }
  // to stop the warning of calling setState of unmounted component
  componentWillMount() {
    var url = window.location.href.toString();
    var screen = url.substring(url.lastIndexOf('/') + 1);
    this.setState({ screen: screen});
    this.getServlet(url.substring(url.lastIndexOf('/') + 1), this.onSucess, this.onError);
  }

  getServlet = (screen, onSucess, onError) => {

    var url = settings.URL + "orders/screen/?code=" + screen;
    axios.get(url, {
      headers: {
        "Content-type": 'application/json',
        "Cookie": "csrftoken=6cuFbdnZfdl9GmVnxYXTOsJpYovrHmOW; sessionid=msfm2koship9xnks87libe72vx7svpvc"
      }
    })
      .then(function (response) {
        if (response.data) {
          onSucess(response.data);
        } else {
          console.log('Logged In');
        };
      })
      .catch(function (error) {
        console.log("otro", error);
      });
  };


  getHistory = (orderId, onSucess, onError) => {

    var url = settings.URL + "orders/order_history?id=" + orderId;
    var user = localStorage.getItem("userdata")
    var token = "";
    if (user) {
      var uo = JSON.parse(user);
      token = uo.session;
    }

    axios.get(url, {
      headers: {
        Authorization: token //the token is a variable which holds the token
      }
    })
      .then(function (response) {
        if (response.data) {
          onSucess(response.data);
        } else {
          console.log('Logged In');
        };
      })
      .catch(function (error) {
        console.log("otro", error);
      });
  };


  openEdit = (c) => {
    this.setState({ data: c, open: true })
  }


  update = () => {
    this.updateDatabase(this.onSucessUpdate, this.onErrorUpdate)

  }


  updateDatabase = (onSucess, onError) => {
    this.setState({ open: false })

    var datav = { model: "enterprise", data: this.state.data }

    var url = settings.URL + "beneficios/update/";
    axios.post(url, datav, {
      'Content-Type': 'application/json;charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
    })
      .then(function (response) {
        if (response.data) {
          onSucess(response.data);
        } else {
          console.log('Logged In');
        };
      })
      .catch(function (error) {
        alert(error);

        console.log("otro", error);
      });


  }
  onSucessUpdate = (dict) => {
    var url = window.location.href.toString();
    this.getServlet(url.substring(url.lastIndexOf('/') + 1), this.onSucess, this.onError);
  }

  onErrorUpdate = (dict) => {
    alert(dict);
  }
  

  Delete = (idv, onSucess, onError) => {
    this.setState({ open: false })

    var datav = { model: "enterprise", data: { id: idv } }

    var user = localStorage.getItem("userdata")
    var token = "";
    if (user) {
      var uo = JSON.parse(user);
      token = uo.session;
    }
    var url = settings.URL + "beneficios/delete/";
    axios.post(url, datav, {
      headers : {
      'Content-Type': 'application/json;charset=UTF-8',
       'Authorization': token 
      }})
      .then(function (response) {
        if (response.data) {
          onSucess(response.data);
        } else {
          console.log('Logged In');
        };
      })
      .catch(function (error) {
        alert(error);

        console.log("otro", error);
      });


  }
  onSucessDelete = (dict) => {
    this.getOrganizations(this.onSucess, this.onError);
  }

  onErrorDelete = (dict) => {
    alert(dict.error_msg);
  }


  openDelete = (id) => {
    //
    Swal.fire({
      title: 'Eliminar',
      icon: 'info',
      html:
        'Confirma eliminar la organizacion, ',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.Delete(id, this.onSucessDelete, this.onErrorDelete);
      }
    });
  }

  onSucess = (dict) => {
    this.setState({ boxs: dict.boxs, edit_screen: dict.screen_trx })
    return;
  }

  onError = (dict) => {
    alert("eerror");
    this.setState({ results: [] });
  }

  openNew = () => {

    this.setState({ data: {}, open: true })
  }

  onClose = () => {
    this.setState({ open: false })
  }

  editCustom = (dict) => {
    if (this.state.screen === 'order') {
      window.location = '/new-order?id=' + dict.id;

    }
  }

  deleteCustom = (dict) => {
    if (this.state.screen === 'order') {
      window.location = '/new-order?idd=' + dict;

    }
  }

  closeHistory = () => {
    this.setState({ showHistory: false });
  }

  onSucessHistory = (dict) => {
    this.setState({ hisotry: dict.response, showHistory: true });
  }


  orderHistory = (id) => {
    this.getHistory(id, this.onSucessHistory, this.onErrorHistory)
  }

  render() {
    const { classes } = this.props;
    var editCustom = null;
    var deleteCustom = null;
    if (this.state.screen === 'order') {
      editCustom = this.editCustom;
      deleteCustom = this.deleteCustom;
    }
    var self = this;
    return (
      <GridContainer>

        {this.state.boxs.map((section) =>
          <Card>
            <CardHeader color="success" icon>
              <CardIcon color="success">
                <EditIcon />
              </CardIcon>
              <h4 className="card-icon-title">{section.title}</h4>
            </CardHeader>
            <CardBody className="edit-customer-form">


              <GridContainer>

                <GridItem xs={section.colspan} sm={section.colspan} md={section.colspan}>

                  {section.box_type === 'list' ?
                    <CustomTable
                      filtrable={true}
                      tableHeaderColor="primary"
                      tableHead={section.header}
                      endpoint={section.endpoint}
                      screen_trx={section.screen_trx}
                      editCustom={editCustom}
                      deleteCustom={deleteCustom}
                      onHistory={this.orderHistory}
                      openadd={true}
                      colorsColls={["primary"]}
                    />
                    : <div />}
                </GridItem>

                <Dialog
                  fullWidth
                  maxWidth={this.state.maxWidth || 'md'}
                  open={this.state.showHistory}
                >
                  <DialogTitle className="create-address-title">
                    Histórico
                    </DialogTitle>
                  <DialogContent style={{ height: '80%' }}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>

                        <Table
                          filtrable={true}
                          maxHeight={600}
                          tableHeaderColor="primary"
                          tableHead={[
                            {"accessor": "id", "Header": "Order id"},
                            {"accessor": "status", "Header": "Estado"},
                            {"accessor": "budget_original", "Header": "Presupuesto original"},
                            {"accessor": "additional", "Header": "Adicional"},
                            {"accessor": "budget_total", "Header": "Presupuesto total"},
                            {"accessor": "saldo", "Header": "Saldo"},
                            {"accessor": "date_update", "Header": "Fecha actualizacion"},
                            {"accessor": "user_update", "Header": "Usuario actualizacion"},
                          ]}

                          tableData={this.state.hisotry}
                          colorsColls={["primary"]}
                        />
                      </GridItem>

                    </GridContainer>
                  </DialogContent>

                  <footer>
                    <GridContainer>


                      <GridItem xs={10} sm={10} md={10}>
                      </GridItem>
                      <GridItem xs={2} sm={2} md={2}>

                        <Button
                          key="close"
                          aria-label="Close"
                          color="danger"
                          onClick={this.closeHistory}>
                          Cerrar
                            </Button>
                      </GridItem>
                    </GridContainer>
                  </footer>
                </Dialog>



              </GridContainer>

            </CardBody>
          </Card>

        )}
      </GridContainer>

    );
  }
}

export default withStyles(styles)(GenericServlet);
