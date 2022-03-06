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
import Button from "@material-ui/core/Button";
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import XLSX from 'xlsx'

import Email from '@material-ui/icons/Email';
import Saves from '@material-ui/icons/SaveAltOutlined';

import Log from '@material-ui/icons/VerifiedUser';
import Excel from '@material-ui/icons/FormatListNumbered';
import ViewIcon from '@material-ui/icons/ViewCarousel';



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
import Swal from 'sweetalert2'
import { cardTitle } from "assets/jss/material-dashboard-pro-react.jsx";
import Table from "components/Table/Table.jsx";
import FileSaver from 'file-saver';
import { Tooltip } from "@material-ui/core";

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


class CustomTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      headers: [],
      invoicetypes: [],
      delivery_type: [
        { "id": 0, "name": "Local" },
        { "id": 1, "name": "Deposito" },
        { "id": 2, "name": "Domicilio" },
      ],
      open: false,
      data: {},
      trxheaders: [],
      boxs: [],
      data: {},
    };
  }


  // to stop the warning of calling setState of unmounted component
  componentWillMount() {
    this.setState({ endpoint: this.props.endpoint });
    this.getServlet(this.onSucess, this.onError);
    if (this.props.endpoint === 'orders/model?code=customer') {
      this.getServletModel("invoicetype", this.onSucessModel, this.onErrorModel);
    }

  }

  getServlet = (onSucess, onError) => {
    var url = settings.URL + this.props.endpoint

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
    }).then(response => {
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


  getServletModel = (model, onSucess, onError) => {

    var url = settings.URL + "orders/model/?code=" + model;
    var user = localStorage.getItem("userdata")
    var token = "";
    if (user) {
      var uo = JSON.parse(user);
      token = uo.session;
    }
    console.log(token);
    axios.get(url, {
      headers: {
        Authorization: token //the token is a variable which holds the token
      }
    })
      .then(function (response) {
        if (response.data) {
          onSucess(model, response.data);
        } else {
          console.log('Logged In');
        };
      })
      .catch(function (error) {
        console.log("otro", error);
      });
  };

  onSucessModel = (model, dict) => {
    this.setState({ [model + "s"]: dict.response });
  }

  onErrorModel = (dict) => {
    alert(dict);
  }

  openEdit = (c) => {

    if (this.props.editCustom) {
      this.props.editCustom(c);
      return;
    }
    this.setState({ data: c, open: true })
  }

  sendMail = (id) => {
    this.SendMail(id, this.onSucessMail, this.onErrorMail);
  }

  SendMail = (idv, onSucess, onError) => {

    var url = settings.URL + "orders/order_sendmail?id=" + idv;
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

  saveExcel = (id) => {
    this.getExcel(id, -1 , this.onSucessMail, this.onErrorMail);
  }

  globalExcel = () => {
    this.getExcel(-1,2, this.onSucessMail, this.onErrorMail);
  }

  globalExcelEnProd = () => {
    this.getExcel(-1,3, this.onSucessMail, this.onErrorMail);
  }

  exportToExcel = (items) => {
    const { t } = this.props
    let r = [];
    let show = true;
    let fields = [];
    if(show) {
        fields = {
            "date_entered":"Fecha",
            "user_meli": "Usuario ML",
            "name":"Nombre",
            "quantity":"Cantidad",
            "cloth1":"Tela",
            "color1":"Color",
            "width":"Ancho",
            "height":"Alto",
            "drop1":"Caida",
            "chain1":"Cadena",
            "plinth1":"Zocalo",
            "type":"Tipo",
            "notes":"Observaciones",
            "envio":"Envio",
            "source":"Fuente"

        }
    }
    r.push(fields);

    items.map(e => {
        r.push(e);
    })

    var fileName = `items`;
    var fileType = "xlsx";
    var fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(r, { skipHeader: 1 });
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data2 = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data2, fileName + fileExtension);
    return;
}
  
getExcel = (idv, status, onSucess, onError) => {

  var url = settings.URL + "orders/oder_get_excel?id=" + idv + "&status=" + status;
  var user = localStorage.getItem("userdata")
  var token = "";
  if (user) {
    var uo = JSON.parse(user);
    token = uo.session;
  }
  var self = this;
  axios.get(url, {
    headers: {
      Authorization: token //the token is a variable which holds the token
    }
  })
    .then(function (response) {
      console.log(response.data);
      if (response.data) {
        self.exportToExcel(response.data.response);
        if (idv == -1) {
          self.getServlet(self.onSucess, self.onError);
        }
      } else {
        console.log('Logged In');
      };
    })
    .catch(function (error) {
      alert(error);
      console.log("otro", error);
    });
};

onHistory = (id) => {
  this.props.onHistory(id);
}

setEmail = (idv) => {

  var url = settings.URL + "orders/send_mail?id=" + idv;
  var user = localStorage.getItem("userdata")
  var token = "";
  if (user) {
    var uo = JSON.parse(user);
    token = uo.session;
  }
  var self = this;
  axios.get(url, {
    headers: {
      Authorization: token //the token is a variable which holds the token
    }
  })
    .then(function (response) {
      console.log(response.data);
      alert("Se envio el prespuesto por mail.");
    })
    .catch(function (error) {
      console.log("otro", error);
      alert(error);

    });
};

renderHTML = (naneCustomer, idv) => {

  var url = settings.URL + "orders/render_html?id=" + idv;
  var user = localStorage.getItem("userdata")
  var token = "";
  if (user) {
    var uo = JSON.parse(user);
    token = uo.session;
  }
  var self = this;
  axios.get(url, {
    headers: {
      Authorization: token //the token is a variable which holds the token
    }
  })
    .then(function (response) {
      var fileName = naneCustomer;
      var fileExtension = ".html";
      const data2 = new Blob([response.data.response.html], { type: "html" });
      FileSaver.saveAs(data2, fileName + fileExtension);
      })
    .catch(function (error) {
      console.log("otro", error);
      alert(error);

    });
};

sendEmail = (id) => {
  this.setEmail(id)
}

sendExcel = (id) => {
  this.saveExcel(id);
}

onSucess = (dict) => {


  let data = dict.response.map(c => {
    var row = c
    if (this.props.endpoint === 'orders/model?code=order') {
      row['actions'] = (
        <div className="customers-actions" style={{ width: 200 }}>
          <Tooltip title='Editar'>
            <Edit color='secondary' fontSize='small' onClick={() => this.openEdit(c)} />
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Delete color='secondary' fontSize='small' onClick={() => this.openDelete(c.id)} />
          </Tooltip>
          <Tooltip title='Enviar por mail'>  
            <Email color='secondary' fontSize='small' onClick={() => this.sendEmail(c.id)} />
          </Tooltip>
          <Tooltip title='Ver historia'>
            <Log color='secondary' fontSize='small' onClick={() => this.onHistory(c.id)} />
          </Tooltip>
          <Tooltip title='Enviar Excel'>
            <Excel color='secondary' fontSize='small' onClick={() => this.sendExcel(c.id)} />
          </Tooltip>
          <Tooltip title='Nostrar HTML'>
            <ViewIcon color='secondary' fontSize='small' onClick={() => this.renderHTML(c.customer, c.id)} />
          </Tooltip>
        </div>
      )

    } else {

      row['actions'] = (
        <div className="customers-actions">
          <Button color="info" authority="customers_view_mr" onClick={() => this.openEdit(c)}>
            <Edit color='secondary' fontSize='small' />
          </Button>
          <Button color="info" authority="customers_view_mr" onClick={() => this.openDelete(c.id)}>
            <Delete color='secondary' fontSize='small' />
          </Button>

        </div>
      )

    }
    return row

  });
  this.setState({ results: data });

}

onError = (dict) => {
  alert(dict);
  this.setState({ results: [] });
}

openNew = () => {

  if (this.props.endpoint === 'orders/model?code=order') {
    window.location = '/admin/new-order';
  } else {
    this.setState({ data: {}, open: true })
  }

}

onClose = () => {
  this.setState({ open: false })
}

update = () => {
  this.updateDatabase(this.onSucessUpdate, this.onErrorUpdate);
}

updateDatabase = (onSucess, onError) => {
  this.setState({ open: false })
  var datav = { model: this.props.screen_trx.boxs[0].model, data: this.state.data }
  var url = settings.URL + this.props.screen_trx.boxs[0].endpoint
  var user = localStorage.getItem("userdata")
  var token = "";
  if (user) {
    var uo = JSON.parse(user);
    token = uo.session;
  }

  axios.post(url, JSON.stringify(datav), {
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
      alert(error);

      console.log("otro", error);
    });


}
onSucessUpdate = (dict) => {
  //this.getOrganizations(this.onSucess, this.onError);
  this.getServlet(this.onSucess, this.onError);

}

onErrorUpdate = (dict) => {
  alert(dict);
}


Delete = (idv, onSucess, onError) => {
  this.setState({ open: false })

  var user = localStorage.getItem("userdata")
  var token = "";
  if (user) {
    var uo = JSON.parse(user);
    token = uo.session;
  }

  var url = settings.URL + this.props.screen_trx.boxs[0].endpoint + "&id=" + idv
  axios.delete(url,  {
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
      alert(error);

      console.log("otro", error);
    });


}
onSucessDelete = (dict) => {
  this.getServlet(this.onSucess, this.onError);
}

onErrorDelete = (dict) => {
  alert(dict.error_msg);
}


openDelete = (id) => {


  if (this.props.deleteCustom) {
    this.props.deleteCustom(id);
    return;
  }

  Swal.fire({
    title: 'Eliminar',
    icon: 'info',
    html:
      'Confirma eliminar  ' + this.props.screen_trx.boxs[0].title,
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


render() {
  const { classes } = this.props;
  console.log(this.props.tableHead);
  return (

    <div>
      <GridContainer>


        <GridItem xs={1} sm={1} md={1} style={{ aligItems: 'right' }}>
          <Button
            simple
            justIcon
            color='info'
            style={{ backgroundColor: '#026C7C', color: 'white' }}
            onClick={() => {
              this.openNew();
            }}
          >
            Nuevo 
            </Button>
        </GridItem>
        {this.props.endpoint === 'orders/model?code=order' ?
        <GridContainer xs={6} sm={6} md={6}>
          <GridItem xs={4} sm={4} md={4} style={{ aligItems: 'right' }}>
            <Button
              simple
              justIcon
              color='info'
              style={{ backgroundColor: '#026C7C', color: 'white' }}
              onClick={() => {
                this.globalExcel();
              }}
            >Exportar excel a producción</Button>
          </GridItem>
          <GridItem xs={4} sm={4} md={4} style={{ aligItems: 'right' }}>
          <Button
            simple
            justIcon
            color='info'
            style={{ backgroundColor: '#026C7C', color: 'white' }}
            onClick={() => {
              this.globalExcelEnProd();
            }}
          >Informe de producción</Button>
        </GridItem>

        </GridContainer>
      : <div/> }
      </GridContainer>
      <GridItem xs={12} sm={12} md={12} style={{  }}>
        <Table
          filtrable={true}
          tableHeaderColor="primary"
          tableHead={this.props.tableHead}
          tableData={this.state.results}
          colorsColls={["primary"]}
        />
      </GridItem>
      {this.state.open ?
        <CustomDialog
          open={this.state.open}
          onClose={this.onClose}
          onSucess={this.update}
          title={this.props.screen_trx.boxs[0].title}
          data={this.state.data}
          onSelect={{
            invoice_type: this.state.invoicetypes,
            delivery_type: this.state.delivery_type
          }}
          fields={this.props.screen_trx.boxs[0].header}>
        </CustomDialog>
        : <div />
      }</div>

  );
}
}

export default withStyles(styles)(CustomTable);
