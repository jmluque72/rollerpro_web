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
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2'

import Delete from '@material-ui/icons/Delete';

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

import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import Table from "components/Table/Table.jsx";
import Button from '@material-ui/core/Button';

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



class Convenios extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      headers: [],
      partner: [],
      open: false,
      data:{}
    };
  }
  // to stop the warning of calling setState of unmounted component
  componentWillMount() {
    this.getPartner(this.onSuccessP, this.onErrorP);

    this.getOrganizations(this.onSucess, this.onError);

  }

  getPartner = (onSucess, onError) => {

    var url = settings.URL + "beneficios/partners/";
    axios.get(url)
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
  };

  getOrganizations = (onSucess, onError) => {

    var url = settings.URL + "beneficios/benefits/";
    axios.get(url)
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
  };


  openEdit = (c) => {
    this.setState({data: c, open: true})
  }


  openDelete = (id) => {
    this.setState({open: true})
  }

  onSucess = (dict) => {
    var result = []
    let data = dict.response.data.map(c => {
      var row = c
      row['actions'] = (
        <div className="customers-actions">
            <Button color="info" authority="customers_view_mr" onClick={() => this.openEdit(c)}>
                <Edit color='secondary' fontSize='small'/>
            </Button>
            <Button  color="info" authority="customers_view_mr" onClick={() => this.openDelete(c.id)}>
                <Delete  color='secondary' fontSize='small'/>
            </Button>
        </div>
      )
      return row

    });
    var headers = [];
    var trxheaders = [];
    
    for (var idx = 0; idx < dict.response.header.length;idx++) {
      if (dict.response.header[idx].view) {
        headers.push(dict.response.header[idx]);
      }
      if (dict.response.header[idx].editable) {
        trxheaders.push(dict.response.header[idx]);
      }
    }
    this.setState({ headers: headers, trxheaders: trxheaders, results: data});
    
  }

  Delete = (idv, onSucess, onError) => {
    this.setState({open: false})

    var datav = {model: "benefits", data: {id: idv}}

    var url = settings.URL + "beneficios/delete/";
    axios.post(url, datav,  {
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
  onSucessDelete = (dict) => {
    this.getOrganizations(this.onSucess, this.onError);
  }

  onErrorDelete = (dict) => {
    alert(dict.error_msg);
  }

  onSuccessP = (dict) => {
    this.setState({partner: dict});
  }

  onErrorP = (dict) => {
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
      confirmButtonText:"Confirmar",
      cancelButtonText:"Cancelar",
    }).then((result) => {
      if (result.value) {
        this.Delete(id,this.onSucessDelete, this.onErrorDelete);
      }
    });
  }

  update = () => {

    this.updateDatabase(this.onSucessUpdate, this.onErrorUpdate)

  }


  updateDatabase = (onSucess, onError) => {
    this.setState({open: false})

    var datav = {model: "benefit", data: this.state.data}

    var url = settings.URL + "beneficios/update/";
    axios.post(url, datav,  {
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
    this.getOrganizations(this.onSucess, this.onError);
  }

  onErrorUpdate = (dict) => {
    alert(dict);
  }

  onError = (dict) => {
    this.setState({ results: [] });
  }

  openNew = () => {
    this.setState({open: true})
  }

  onClose = () => {
    this.setState({open: false})
  }

  addNew = () => {
    this.setState({open: true})
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={11} sm={11} md={11}>
          </GridItem>
          <GridItem xs={1} sm={1} md={1}>
            <Button variant="contained" color='primary' onClick={this.addNew}>
              Agregar
            </Button>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Table
              filtrable={true}
              tableHeaderColor="primary"
              tableHead={this.state.headers}
              tableData={this.state.results}
              colorsColls={["primary"]}
            />
          </GridItem>
          {this.state.open ?
              <CustomDialog 
                open={this.state.open}
                onClose={this.onClose}
                title={'Convenios'}
                onSucess={this.update}
                onSelect={{"partner": (this.state.partner && this.state.partner.response ? this.state.partner.response.data : []) }}
                data={this.state.data}
                fields={this.state.trxheaders}>
              </CustomDialog>
          : <div/> }
        </GridContainer>
        
      </div>
    );
  }
}

export default withStyles(styles)(Convenios);
