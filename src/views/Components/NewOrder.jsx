import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import settings from "settings";
import Button from 'components/CustomButtons/Button';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import CardIcon from 'components/Card/CardIcon';
import EditIcon from '@material-ui/icons/Edit';
import CustomInput from "components/CustomInput/CustomInput.jsx";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import queryString from 'query-string';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
import SelectC from '@material-ui/icons/SelectAllSharp'
import AccessAlarmIcon from '@material-ui/icons/AccountBalance';
import Tooltip from '@material-ui/core/Tooltip'
import moment from 'moment'
import "./Main.css"

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


class NewOrder extends React.Component {

    constructor(props) {
        super(props);
        var now = moment().format("YYYY-MM-DD");
        this.state = {
            loadTemplate: 100,
            screen: "",
            results: [],
            headers: [],
            open: false,
            data: {},
            boxs: [],
            edit_screen: {},
            customer: [],
            invoicetype: [],
            sources: [],
            user_meli: "",
            payment_types: [],
            items: [],
            shippingCompanys: [],
            userProfiles: [],
            item: {},
            date_delivery: now,
            date_entered: now,
            date_extra2: now,
            date_extra1: now,
            status: 1,
            old_status: "",
            cloths: [],
            colors1: [],
            colors2: [],

            plinths: [],
            chains: [],
            drops: [],

            quien_retira: "",
            donde_retira: "0",
            dni_retira: "",
            empresa_retira: "",
            presupuesto_nota: "",
            pago_nota: "",
            adicionales_nota: "",
            saldo_nota: "",
            envio_nota: "",
            presupuesto_total_nota: "",
            customer_note: "",
            adicional_note: "",
            invoice_type: "",
            invoice_number: "",
            delivery_address: "",
            delivery_city: "",
            delivery_state: "",
            delivery_phone: "",
            delivery_zipcode: "",
            agent: "",
            source: "",
            budget_original: "",
            envio: "",
            payment: "",
            payment_type: "",
            additional: "",
            saldo: "",
            shipping_payment: "",
            customers: [],
            budget_total: "",
            invoicetypes: [],
            payment_date: " ",
            payment_date1: " ",
            payment_date2: " ",
            payment_date3: " ",
            payment_date4: " ",
            shipping_date: " ",
            shipping_number: "",
            templates: [],
            template: -1,
            startprint: false,
            statuss: [
                { "id": 0, "name": "Borrado" },
                { "id": 1, "name": "Pendiente cliente" },
                { "id": 2, "name": "Aprobado por el cliente" },
                { "id": 3, "name": "En produccion" },
                { "id": 4, "name": "En entrega" },
                { "id": 9, "name": "Cancelado" },
                { "id": 10, "name": "Con Reclamo Abierto" },
                { "id": 11, "name": "Falta Pago" },
                { "id": 12, "name": "Aprobado con saldo" },
            ],


            donde_retiras: [
                { "id": 0, "name": "Local Maipu" },
                { "id": 1, "name": "Deposito" },
                { "id": 2, "name": "Domicilio" },
                { "id": 3, "name": "Fabrica" },
                { "id": 4, "name": "Local Recta" }

            ],
            shipping_payments: [
                { "id": 0, "name": "Bonificado" },
                { "id": 1, "name": "Pago en destino" },
                { "id": 2, "name": "Pago en origen" },
            ],
        };
    }
    // to stop the warning of calling setState of unmounted component
    componentWillMount() {
        document.body.style.overflow = "hidden"

        this.getServlet("customer", this.onSucessModel, this.onErrorModel);
        this.getServlet("invoicetype", this.onSucessModel, this.onErrorModel);
        this.getServlet("source", this.onSucessModel, this.onErrorModel);
        this.getServlet("payment_type", this.onSucessModel, this.onErrorModel);
        this.getServlet("shippingCompany", this.onSucessModel, this.onErrorModel);
        this.getServlet("userProfile", this.onSucessModel, this.onErrorModel);

        this.getServlet("cloth", this.onSucessModel, this.onErrorModel);
        this.getServlet("color", this.onSucessModel, this.onErrorModel);
        this.getServlet("drop", this.onSucessModel, this.onErrorModel);
        this.getServlet("chain", this.onSucessModel, this.onErrorModel);
        this.getServlet("plinth", this.onSucessModel, this.onErrorModel);
        this.getServlet("clothColor", this.onSucessModel, this.onErrorModel);
        this.getOrder(this.state.loadTemplate, this.onSucessOrderTemplate, this.onErrorOrderTemplate);

        var a = queryString.parse(window.location.search);
        if (a.id) {
            this.setState({ addorder: false, idv: a.id });
            this.getOrder(a.id, this.onSucessOrder, this.onErrorOrder);
        } else {
            this.setState({ addorder: true });
        }
        if (a.idd) {
            this.setState({ delete: true, idv: a.idd });
            this.getOrder(a.idd, this.onSucessOrder, this.onErrorOrder);
        }
    }

    getServlet = (model, onSucess, onError) => {

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
        if (model === 'color') {
            this.setState({ color_original: dict.response, [model + "s"]: dict.response });
        } else {
            this.setState({ [model + "s"]: dict.response });
        }
    }

    onErrorModel = (dict) => {
        alert(dict);
    }

    getOrder = (idv, onSucess, onError) => {

        var url = settings.URL + "orders/order?id=" + idv;
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

    onSucessOrderTemplate = (dict) => {
        this.setState({
            templates: dict.items
        });
    }

    onErrorOrderTemplate = (dict) => {
        alert(dict);
    }


    onSucessOrder = (dict) => {
        this.setState({ date_entered: dict.date_entered });
        this.setState({
            customer: dict.customer,
            date_entered: dict.date_entered,
            date_delivery: dict.date_delivery,
            date_extra1: (dict.date_extra1 ? dict.date_extra1 : ""),
            date_extra2: (dict.date_extra2 ? dict.date_extra2 : ""),
            status: dict.status,
            old_status: dict.status,
            invoice_type: dict.invoice_type,
            invoice_number: dict.invoice_number,
            delivery_address: dict.delivery_address,
            delivery_city: dict.delivery_city,
            delivery_state: dict.delivery_state,
            delivery_phone: dict.delivery_phone,
            delivery_zipcode: dict.delivery_zipcode,
            agent: dict.agent,
            source: dict.source,
            user_meli: dict.user_meli,
            budget_original: dict.budget_original,
            envio: dict.envio,
            additional: dict.additional,
            budget_total: dict.budget_total,
            saldo: dict.saldo,
            items: this.formatV(dict.items),
            shipping_payment: dict.shipping_payment,

            quien_retira: dict.quien_retira,
            donde_retira: dict.donde_retira,
            dni_retira: dict.dni_retira,
            empresa_retira: dict.empresa_retira,
            presupuesto_nota: dict.presupuesto_nota,
            pago_nota: dict.pago_nota,
            adicionales_nota: dict.adicionales_nota,
            saldo_nota: dict.saldo_nota,
            envio_nota: dict.envio_nota,
            customer_note: dict.customer_note,
            presupuesto_total_nota: dict.presupuesto_total_nota,

            adicional_note: dict.adicional_note,
            payment: dict.payment,
            payment_type: dict.payment_type,
            payment_date: (dict.payment_date != null ? dict.payment_date : ""),
            payment_op: dict.payment_op,

            payment1: dict.payment1,
            payment_type1: dict.payment_type1,
            payment_date1: dict.payment_date1,
            payment_op1: dict.payment_op1,

            payment2: dict.payment2,
            payment_type2: dict.payment_type2,
            payment_date2: dict.payment_date2,
            payment_op2: dict.payment_op2,

            payment3: dict.payment3,
            payment_type3: dict.payment_type3,
            payment_date3: dict.payment_date3,
            payment_op3: dict.payment_op3,

            payment4: dict.payment4,
            payment_type4: dict.payment_type4,
            payment_date4: dict.payment_date4,
            payment_op4: dict.payment_op4,
            payment_note: dict.payment_note,

            shipping_company: dict.shipping_company,
            shipping_date: dict.shipping_date != null ? dict.shipping_date : " ",
            shipping_number: dict.shipping_number,
            user: dict.user,


        });
    }

    onErrorOrder = (dict) => {
        alert(dict);
    }

    openEdit = (c) => {
        this.setState({ data: c, open: true })
    }

    deleteOrder = () => {

        //
        Swal.fire({
            title: 'Eliminar',
            icon: 'info',
            html:
                'Confirma eliminar la orden ' + this.state.id,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.value) {
                this.Delete(this.onSucessDelete, this.onErrorDelete);
            }
        });
    }

    Delete = (onSucess, onError) => {
        this.setState({ open: false })

        var user = localStorage.getItem("userdata")
        var token = "";
        if (user) {
            var uo = JSON.parse(user);
            token = uo.session;
        }

        var url = settings.URL + "orders/order/?id=" + this.state.idv;
        axios.delete(url, {
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
        window.location = '/order';
    }

    onErrorDelete = (dict) => {
        alert(dict.error_msg);
    }

    saveOrder = () => {

        if (this.state.old_status != this.state.status) {
            if (this.state.old_status == 11) {
                alert(this.state.saldo);
                if (this.state.saldo > (this.state.budget_total/2)) {
                    alert("FALTA ABONAR PRODUCTO. NO PUEDE CAMBIAR EL ESTADO DE FALTA DE PAGO.");
                    return;
                }
            }
        }

        if (this.state.customer === "") {
            alert("Debe completar cliente");
            return;
        }
        if (this.state.date_entered === "") {
            alert("Debe completar Fecha Factura");
            return;
        }
        if (this.state.date_delivery === "") {
            alert("Debe completar Fecha Entrega");
            return;
        }
        if (this.state.invoice_type === "") {
            alert("Debe completar Tipo de Factura");
            return;
        }
        if (this.state.shipping_payment === "") {
            alert("Debe completar Tipo de pago entrega");
            return;
        }
        if (this.state.payment_type === "") {
            alert("Debe completar al menos un Tipo de pago");
            return;
        }
        if (this.state.status === "") {
            alert("Debe completar estado");
            return;
        }
        if (this.state.source === "") {
            alert("Debe completar Origen");
            return;
        }
        if (this.state.budget_original === "") {
            alert("Debe completar Prespuesto original");
            return;
        }
        if (this.state.envio === "") {
            alert("Debe completar Envio");
            return;
        }
        if (this.state.payment === "") {
            alert("Debe completar Pago");
            return;
        }
        if (this.state.user == null || this.state.user === "" || this.state.user.length == 0) {
            alert("Debe completar Vendedor");
            return;
        }

        this.updateDatabase(this.onSucessUpdate, this.onErrorUpdate)

    }

    updateDatabase = (onSucess, onError) => {

        this.setState({ open: false })
        var body = {}
        if (this.state.addorder) {
            body = {
                customer: this.state.customer,
                date_entered: this.state.date_entered,
                date_delivery: this.state.date_delivery,
                date_extra1: this.state.date_extra1,
                date_extra2: this.state.date_extra2,

                status: this.state.status,
                invoice_type: this.state.invoice_type,
                invoice_number: this.state.invoice_number,
                delivery_address: this.state.delivery_address,
                delivery_city: this.state.delivery_city,
                delivery_state: this.state.delivery_state,
                delivery_phone: this.state.delivery_phone,
                delivery_zipcode: this.state.delivery_zipcode,

                quien_retira: this.state.quien_retira,
                donde_retira: this.state.donde_retira,
                dni_retira: this.state.dni_retira,
                empresa_retira: this.state.empresa_retira,
                presupuesto_nota: this.state.presupuesto_nota,
                pago_nota: this.state.pago_nota,
                adicionales_nota: this.state.adicionales_nota,
                saldo_nota: this.state.saldo_nota,
                envio_nota: this.state.envio_nota,
                customer_note: this.state.customer_note,
                adicional_note: this.state.adicional_note,
                presupuesto_total_nota: this.state.presupuesto_total_nota,

                agent: this.state.agent,
                source: this.state.source,
                user_meli: this.state.user_meli,
                budget_original: this.state.budget_original,
                envio: this.state.envio,
                additional: this.state.additional && this.state.additional.trim().length > 0 ? this.state.additional : 0,
                budget_total: this.state.budget_total != '' ? this.state.budget_total : 0,

                saldo: this.state.saldo && this.state.saldo != '' ? this.state.saldo : 0,
                items: this.state.items,
                shipping_payment: this.state.shipping_payment,

                payment: this.state.payment,
                payment_type: this.state.payment_type,
                payment_date: this.state.payment_date && this.state.payment_date.trim().length == 0 ? null : this.state.payment_date,
                payment_op: this.state.payment_op,

                payment1: this.state.payment1,
                payment_type1: this.state.payment_type1,
                payment_date1: this.state.payment_date1 && this.state.payment_date1.trim().length == 0 ? null : this.state.payment_date1,
                payment_op1: this.state.payment_op1,

                payment2: this.state.payment2,
                payment_type2: this.state.payment_type2,
                payment_date2: this.state.payment_date2 && this.state.payment_date2.trim().length == 0 ? null : this.state.payment_date2,
                payment_op2: this.state.payment_op2,

                payment3: this.state.payment3,
                payment_type3: this.state.payment_type3,
                payment_date3: this.state.payment_date3 && this.state.payment_date3.trim().length == 0 ? null : this.state.payment_date3,
                payment_op3: this.state.payment_op3,

                payment4: this.state.payment4,
                payment_type4: this.state.payment_type4,
                payment_date4: this.state.payment_date4 && this.state.payment_date4.trim().length == 0 ? null : this.state.payment_date4,
                payment_op4: this.state.payment_op4,

                payment_note: this.state.payment_note,

                shipping_company: this.state.shipping_company,
                shipping_number: this.state.shipping_number,
                shipping_date: this.state.shipping_date && this.state.shipping_date.trim().length == 0 ? null : this.state.shipping_date,

                user: this.state.user,

            }
        } else {

            body = {
                id: this.state.idv,
                customer: this.state.customer,
                date_entered: this.state.date_entered,
                date_delivery: this.state.date_delivery,
                date_extra1: this.state.date_extra1,
                date_extra2: this.state.date_extra2,
                status: this.state.status,
                invoice_type: this.state.invoice_type,
                invoice_number: this.state.invoice_number,
                delivery_address: this.state.delivery_address,
                delivery_city: this.state.delivery_city,
                delivery_state: this.state.delivery_state,
                delivery_phone: this.state.delivery_phone,
                delivery_zipcode: this.state.delivery_zipcode,
                agent: this.state.agent,
                source: this.state.source,
                user_meli: this.state.user_meli,
                budget_original: this.state.budget_original,
                envio: this.state.envio,
                additional: this.state.additional,
                budget_total: this.state.budget_total,
                saldo: this.state.saldo,
                items: this.state.items,
                shipping_payment: this.state.shipping_payment,

                quien_retira: this.state.quien_retira,
                donde_retira: this.state.donde_retira,
                dni_retira: this.state.dni_retira,
                empresa_retira: this.state.empresa_retira,
                presupuesto_nota: this.state.presupuesto_nota,
                pago_nota: this.state.pago_nota,
                adicionales_nota: this.state.adicionales_nota,
                saldo_nota: this.state.saldo_nota,
                envio_nota: this.state.envio_nota,
                customer_note: this.state.customer_note,
                adicional_note: this.state.adicional_note,
                presupuesto_total_nota: this.state.presupuesto_total_nota,


                payment: this.state.payment,
                payment_type: this.state.payment_type,
                payment_date: this.state.payment_date == '' ? null : this.state.payment_date,
                payment_op: this.state.payment_op,

                payment1: this.state.payment1,
                payment_type1: this.state.payment_type1,
                payment_date1: this.state.payment_date1 == '' ? null : this.state.payment_date1,
                payment_op1: this.state.payment_op1,

                payment2: this.state.payment2,
                payment_type2: this.state.payment_type2,
                payment_date2: this.state.payment_date2 == '' ? null : this.state.payment_date2,
                payment_op2: this.state.payment_op2,

                payment3: this.state.payment3,
                payment_type3: this.state.payment_type3,
                payment_date3: this.state.payment_date3 == '' ? null : this.state.payment_date3,
                payment_op3: this.state.payment_op3,

                payment4: this.state.payment4,
                payment_type4: this.state.payment_type4,
                payment_date4: this.state.payment_date4 == '' ? null : this.state.payment_date4,
                payment_op4: this.state.payment_op4,
                payment_note: this.state.payment_note,

                shipping_company: this.state.shipping_company,
                shipping_number: this.state.shipping_number,
                shipping_date: this.state.shipping_date.trim().length == 0 ? null : this.state.shipping_date,

                user: this.state.user,


            }
        }
        var url = settings.URL + "orders/order/";
        var user = localStorage.getItem("userdata")
        var token = "";
        if (user) {
            var uo = JSON.parse(user);
            token = uo.session;
        }

        axios.post(url, JSON.stringify(body), {
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
        window.location = '/order';
    }

    onErrorUpdate = (dict) => {
        alert(dict);
    }




    openDelete = (id) => {
        Swal.fire({
            title: 'Eliminar',
            icon: 'info',
            html:
                'Confirma eliminar el item, ',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.value) {
                var items = this.state.items;
                var index = items.indexOf(id);
                if (index !== -1) items.splice(index, 1);
                this.setState({ items: items });
            }
        });
    }


    onSucess = (dict) => {
        this.setState({ boxs: dict.boxs, edit_screen: dict.screen_trx })
        return;
        var result = []
        let data = dict.response.data.map(c => {
            var row = c
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
            return row

        });
        var headers = [];
        var trxheaders = [];

        for (var idx = 0; idx < dict.response.header.length; idx++) {
            if (dict.response.header[idx].view) {
                headers.push(dict.response.header[idx]);
            }
            if (dict.response.header[idx].editable) {
                trxheaders.push(dict.response.header[idx]);
            }
        }
        this.setState({ trxheaders: trxheaders, results: data });

    }

    onError = (dict) => {
        this.setState({ results: [] });
    }

    openNew = () => {
        this.clean();
        this.setState({
            item: this.getBlankField(),
            add: true,
            addItemOpen: true
        })
    }

    closeNew = () => {
        this.setState({ addItemOpen: false })
    }
    onClose = () => {
        this.setState({ open: false })
    }

    shippingCompanyLoad = () => {
        for (var idx = 0; idx < this.state.shippingCompanys.length; idx++) {
            if (this.state.shippingCompanys[idx].id == this.state.shipping_company) {
                document.getElementById("shiping_code").innerHTML =
                    this.reemplaze(this.state.shippingCompanys[idx].message, this.state.shipping_number);

            }
        }
    }

    makeEtiqueta = () => {
        this.getEtiqueta(0);
    }

    makeEtiquetaEnvio = () => {
        this.getEtiqueta(1);
    }

    printEtiquet = () => {
        this.setState({ startprint: true });
        var printContents = document.getElementById("etiqueta_content").innerHTML;
        var printContents2 = document.getElementById("content_print_real");

        printContents2.innerHTML = printContents;
        window.print();
        this.setState({ startprint: false });

    }

    getEtiqueta = (type) => {

        var url = settings.URL + "orders/get_etiqueta?id=" + this.state.idv + "&type=" + type;
        var user = localStorage.getItem("userdata")
        var token = "";
        //this.setState({ showEtiqueta: true });
        if (user) {
            var uo = JSON.parse(user);
            token = uo.session;
        }
        var self = this;
        return window.open(url, "_blank");

    };

    reemplaze = (message, value) => {
        var row = {}
        for (var idx = 0; idx < this.state.customers.length; idx++) {
            if (this.state.customers[idx].id == this.state.customer) {
                row = this.state.customers[idx];
            }
        }
        var c = message.replace("{{name}}", row['name']);
        return c.replace("{{guia}}", value);
    }


    change = (value, field, param2) => {

        if (field === 'customer') {
            var row = { delivery_zipcode: "", address: "", city: "", state: "", phone: "" }
            for (var idx = 0; idx < this.state.customers.length; idx++) {
                if (this.state.customers[idx].id == value.target.value) {
                    row = this.state.customers[idx];
                }
            }

            this.setState(
                {
                    customer_name: row['name'],
                    delivery_zipcode: row['zipcode'],
                    delivery_address: row['address'],
                    delivery_city: row['city'],
                    delivery_state: row['state'],
                    delivery_phone: row['phone'],
                    shipping_payment: row['delivery_type']
            })
        }
        if (field === 'shipping_company') {
            if (document.getElementById("shiping_code"))
                document.getElementById("shiping_code").innerHTML = "";

            var snumber = this.state.shipping_number;
            for (var idx = 0; idx < this.state.shippingCompanys.length; idx++) {
                if (this.state.shippingCompanys[idx].id == value.target.value) {
                    if (document.getElementById("shiping_code")) {
                        document.getElementById("shiping_code").innerHTML = this.reemplaze(this.state.shippingCompanys[idx].message, snumber);
                    }
                }
            }
        }
        if (field === 'shipping_number') {
            if (document.getElementById("shiping_code")) {
                document.getElementById("shiping_code").innerHTML = "";
            }
            var snumber2 = value.target.value;
            for (var idx = 0; idx < this.state.shippingCompanys.length; idx++) {
                if (this.state.shippingCompanys[idx].id == this.state.shipping_company) {
                    if (document.getElementById("shiping_code")) {
                        document.getElementById("shiping_code").innerHTML = this.reemplaze(this.state.shippingCompanys[idx].message, snumber2);
                    }
                }
            }
        }
        this.setState({ [field]: value.target.value }, () => {

            var budget_total =
                parseFloat(this.state.budget_original == '' ? 0 : this.state.budget_original) +
                parseFloat(this.state.additional == '' ? 0 : this.state.additional) +
                parseFloat(this.state.envio == '' ? 0 : this.state.envio);


            var saldo =
                parseFloat(this.state.budget_original == '' ? 0 : this.state.budget_original) +
                parseFloat(this.state.additional == '' ? 0 : this.state.additional) -
                (
                    parseFloat(this.state.payment == '' ? 0 : this.state.payment) +
                    parseFloat(this.state.payment1 == '' ? 0 : this.state.payment1) +
                    parseFloat(this.state.payment2 == '' ? 0 : this.state.payment2) +
                    parseFloat(this.state.payment3 == '' ? 0 : this.state.payment3) +
                    parseFloat(this.state.payment4 == '' ? 0 : this.state.payment4)) +
                parseFloat(this.state.envio == '' ? 0 : this.state.envio)
            this.setState({
                saldo: saldo,
                budget_total: budget_total
            })
        });
    }

    __get = (field, value) => {
        var array = null;
        if (field == 'color1') {
            array = this.state.colors1;
        } else if (field == 'color2') {
            array = this.state.colors2;
        } else if (field == 'cloth1' || field == 'cloth2') {
            array = this.state.cloths;
        } else if (field == 'chain1' || field == 'chain2') {
            array = this.state.chains;
        } else if (field == 'drop1' || field == 'drop2') {
            array = this.state.drops;
        } else if (field == 'plinth1' || field == 'plinth2') {
            array = this.state.plinths;
        }
        if (array == null) {
            return value.target.value
        }
        for (var idx = 0; idx < array.length; idx++) {
            if (array[idx]["id"] == value.target.value) {
                return array[idx];
            }
        }
        return value

    }

    changeItemTemplate = (value, field, param2) => {
        var selected = null;
        for (var idx = 0; idx < this.state.templates.length; idx++) {
            if (this.state.templates[idx].id == value.target.value) {
                selected = this.state.templates[idx];
            }
        }

        this.clean();
        var co = [];
        for (var idx = 0; idx < this.state.clothColors.length; idx++) {
            if (this.state.clothColors[idx].cloth == selected['cloth1']['id']) {
                var g = this.getColor(this.state.clothColors[idx].color);
                if (g) {
                    co.push(g)
                }
            }
        }
        this.setState({ colors1: co });

        var co = [];
        for (var idx = 0; idx < this.state.clothColors.length; idx++) {
            if (selected['cloth2'] && this.state.clothColors[idx].cloth == selected['cloth2']['id']) {
                var g = this.getColor(this.state.clothColors[idx].color);
                if (g) {
                    co.push(g)
                }
            }
        }
        this.setState({ colors2: co });
        this.setState({ item: selected })






    }

    changeItem = (value, field, param2) => {

        var valuevalue = this.__get(field, value);
        if (field === 'cloth1' || field === 'cloth2') {
            if (valuevalue.alert && valuevalue.alert.length > 0) {
                Swal.fire(
                    valuevalue.alert)
            }
            var co = [];
            for (var idx = 0; idx < this.state.clothColors.length; idx++) {

                if (this.state.clothColors[idx].cloth == valuevalue['id']) {

                    var g = this.getColor(this.state.clothColors[idx].color);
                    if (g) {
                        co.push(g)
                    }
                }
            }
            if (field == 'cloth1') {
                this.setState({ colors1: co });
            } else {
                this.setState({ colors2: co });

            }
        }

        var t = this.state.item;
        t[field] = valuevalue;
        this.setState({ item: t }, () => {
            var o_w = this.state.item.original_width
            var i_w = this.state.item.width
            var t = this.state.item;

            var f_w = 0
            if (o_w) {
                f_w = f_w + parseFloat(o_w)
            }
            if (i_w) {
                f_w = f_w + parseFloat(i_w);
            }
            t.final_width = ((f_w * 1000) / 1000);

            var o_h = this.state.item.original_height
            var i_h = this.state.item.height
            var f_h = 0
            if (o_h) {
                f_h = f_h + parseFloat(o_h)
            }
            if (i_h) {
                f_h = f_h + parseFloat(i_h);
            }
            t.final_width = ((f_w * 1000) / 1000).toFixed(3);
            t.final_height = ((f_h * 1000) / 1000).toFixed(3);
            t.final_width_system = (f_w + 0.04).toFixed(3);

            this.setState({ item: t });

        });
    }

    getColor = (c) => {
        for (var idx = 0; idx < this.state.color_original.length; idx++) {
            if (this.state.color_original[idx]["id"] === c) {
                return this.state.color_original[idx]
            }
        }
        return null

    }

    saveItem = () => {

        if (!this.state.item.cloth1 ||
            !this.state.item.color1 ||
            !this.state.item.drop1 ||
            !this.state.item.chain1 ||
            !this.state.item.plinth1 ||
            this.state.item.quantity == '' ||
            !this.state.item.original_width ||
            !this.state.item.original_height ||
            !this.state.item.final_width ||
            !this.state.item.final_height ||
            !this.state.item.final_width_system

        ) {
            alert("Debe completar los campos obligatorios");
            return;
        }

        var row = {}
        if (this.state.add) {
            var itemsv = this.state.items
            var a = this.getEditV();
            itemsv.push(a);
            var c = this.formatV(itemsv)
            console.log(itemsv)
            this.setState({ addItemOpen: false })
        } else {
            var itemsv = this.state.items;
            var itema = this.state.item;
            itema.cloth1_name = this.state.item.cloth1.name;
            itema.color1_name = this.state.item.color1.name;
            itema.drop1_name = this.state.item.drop1.name;
            itema.chain1_name = this.state.item.chain1.name;
            itema.plinth1_name = this.state.item.plinth1.name;
            itemsv.splice(this.state.item_index_selected, 1, itema);
            this.setState({ item_index_selected: -1, addItemOpen: false })
        }

    }

    formatV = (items) => {

        var idx = 0;
        let data = items.map(c => {
            c['actions'] = this.renderActions(c, idx)
            c['is_double'] = (c['cloth2'] != null && c['cloth2'] != '' ? "Sí" : "No")
            c['cloth2_name'] = (c['cloth2'] != null ? c['cloth2']['name'] : "")
            c['color2_name'] = (c['color2'] != null ? c['color2']['name'] : "")

            idx++;
            return c;
        });
        return data;
    }

    getEditV = () => {
        return {
            cloth1: this.state.item.cloth1,
            color1: this.state.item.color1,
            drop1: this.state.item.drop1,
            chain1: this.state.item.chain1,
            plinth1: this.state.item.plinth1,

            cloth2: this.state.item.cloth2,
            color2: this.state.item.color2,
            drop2: this.state.item.drop2,
            chain2: this.state.item.chain2,
            plinth2: this.state.item.plinth2,

            quantity: this.state.item.quantity,
            original_width: this.state.item.original_width,
            original_height: this.state.item.original_height,
            width: this.state.item.width,
            height: this.state.item.height,
            notes: this.state.item.notes,
            notes_importante: this.state.item.notes_importante,

            cloth1_name: this.state.item.cloth1.name,
            color1_name: this.state.item.color1.name,
            drop1_name: this.state.item.drop1.name,
            chain1_name: this.state.item.chain1.name,
            plinth1_name: this.state.item.plinth1.name,
            final_width_system: this.state.item.final_width_system,
            final_width: this.state.item.final_width,
            final_height: this.state.item.final_height,

            width_importante: this.state.item.width_importante,
            height_importante: this.state.item.height_importante,
            name_template: this.state.item.name_template
        }
    }

    getBlankField = () => {
        return {
            cloth1: "",
            color1: "",
            drop1: "",
            chain1: "",
            plinth1: "",
            name_template: "",
            cloth2: "",
            color2: "",
            drop2: "",
            chain2: "",
            plinth2: "",

            quantity: "",
            original_width: "",
            original_height: "",
            width: "",
            height: "",
            final_width: "",
            notes: "",
            notes_importante: "",
            notes_customer: "",

            final_height: "",
            final_width_system: ""
        }
    }

    clean = () => {
        this.setState({
            cloth1: "",
            color1: "",
            drop1: "",
            chain1: "",
            plinth1: "",
            name_template: "",
            cloth2: "",
            color2: "",
            drop2: "",
            chain2: "",
            plinth2: "",

            quantity: "",
            original_width: "",
            original_height: "",
            width: "",
            height: "",
            final_width: "",
            notes: "",
            notes_importante: "",
            notes_customer: "",

            final_height: "",
            final_width_system: "",

        });
    }

    renderActions = (key, index) => {
        return (
            <div className="appointments-actions">
                <Tooltip title="Edit">
                    <div>
                        <Button
                            simple
                            justIcon
                            color="info"
                            onClick={() => {
                                this.clean();
                                //this.changeItem(key.cloth1.id, "cloth1", "");
                                var co = [];
                                for (var idx = 0; idx < this.state.clothColors.length; idx++) {
                                    if (this.state.clothColors[idx].cloth == key['cloth1']['id']) {
                                        var g = this.getColor(this.state.clothColors[idx].color);
                                        if (g) {
                                            co.push(g)
                                        }
                                    }
                                }
                                this.setState({ colors1: co });

                                var co = [];
                                for (var idx = 0; idx < this.state.clothColors.length; idx++) {
                                    if (key['cloth2'] && this.state.clothColors[idx].cloth == key['cloth2']['id']) {
                                        var g = this.getColor(this.state.clothColors[idx].color);
                                        if (g) {
                                            co.push(g)
                                        }
                                    }
                                }
                                this.setState({ colors2: co });


                                this.setState({ item_index_selected: index, addItemOpen: true, item: key, add: false })
                            }}
                        >
                            <Edit />
                        </Button>
                    </div>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <div>
                        <Button
                            simple
                            justIcon
                            color="info"
                            onClick={() => {
                                this.openDelete(key)
                            }}
                        >
                            <Delete />
                        </Button>
                    </div>
                </Tooltip>
            </div>
        )
    }

    showPagos = () => {
        this.setState({ showPagos: !this.state.showPagos });
    }

    saveDespachos = () => {
        if (this.state.shipping_date != "" && this.state.shipping_number && this.state.shipping_company) {
            this.updateDatabase(this.onSucessUpdate, this.onErrorUpdate)
        }
    }

    showDespacho = () => {
        this.setState({ showDespacho: !this.state.showDespacho }, () => {

        });
    }
    render() {
        const { classes } = this.props;
        var self = this;
        if (this.state.startprint) {
            return <div id='content_print_real' />
        }
        var user = localStorage.getItem("userdata")
        if (user) {
            user = JSON.parse(user);
        }

        var renderSelector = <div />
        var nameTemplate = <div />

        renderSelector =
            <GridItem xs={12} sm={12} md={12}>
                <p style={{ fontSize: 12, marginBottom: 10 }}>
                    Template
                </p>

                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'template'} id={'template'} onChange={(event) => this.changeItemTemplate(event, "template", "template")}
                >
                    <option value=' ' selected> </option>

                    {this.state.templates.map(c => {
                        var selected = false;
                        return (
                            <option value={c['id']}>{c.name_template}</option>
                        )
                    })}

                </select>
            </GridItem>

        if (this.state.idv != null && this.state.idv == this.state.loadTemplate) {
            nameTemplate =
                <GridItem xs={12} sm={12} md={12}>

                    <CustomInput
                        success={this.state.lastnameState === "success"}
                        error={this.state.lastnameState === "error"}
                        labelText={
                            <span>
                                Nombre Template
                            </span>
                        }
                        id={'name_template'}
                        value={this.state.item.name_template}
                        type={'text'}
                        onChange={(event) => this.changeItem(event, "name_template", "name_template")}
                     
                        formControlProps={{
                            onChange: event => self.changeItem(event, "name_template", "name_template", 3),
                            fullWidth: true
                        }}
                    />
                </GridItem>

        }



        return (

            <GridContainer>

                <GridItem xs={6} sm={6} md={6}>

                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <EditIcon />
                            </CardIcon>
                            <h4 className="card-icon-title">Orden</h4>
                        </CardHeader>
                        <CardBody className="edit-customer-form">
                            <GridContainer>

                                <GridItem xs={12} sm={12} md={12}>


                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Cliente
                                            </p>

                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'customer'} id={'customer'} onChange={(event) => this.change(event, "customer", "customer")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.customers.map(c => {

                                                    var selected = false;
                                                    if (this.state.customer == c['id']) {
                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>


                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}>
                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Tipo de Factura
                                            </p>

                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'invoice_type'} id={'invoice_type'} onChange={(event) => this.change(event, "invoice_type", "invoice_type")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.invoicetypes.map(c => {

                                                    var selected = false;
                                                    if (this.state.invoice_type == c['id']) {
                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>

                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Numero de factura
                                            </span>
                                        }
                                        onChange={(event) => this.change(event, "invoice_number", "invoice_number")}

                                        id={'invoice_number'}
                                        value={this.state.invoice_number}
                                        type={'text'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "invoice_number", "length", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                            </GridContainer>
                        </CardBody>
                    </Card>

                </GridItem>



                <GridItem xs={6} sm={6} md={6}>

                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <EditIcon />
                            </CardIcon>
                            <h4 className="card-icon-title">Workflow</h4>
                        </CardHeader>
                        <CardBody className="edit-customer-form">
                            <GridContainer>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Fecha de compra
                                            </span>
                                        }
                                        id={'date_entered'}
                                        onChange={(event) => this.change(event, "date_entered", "date_entered")}
                                        value={this.state.date_entered}
                                        type={'date'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "date_entered", "date_entered", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Fecha de alta
                                            </span>
                                        }
                                        id={'date_delivery'}
                                        value={this.state.date_delivery}
                                        type={'date'}
                                        onChange={(event) => this.change(event, "date_delivery", "date_delivery")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "date_delivery", "date_delivery", 3),

                                            fullWidth: true
                                        }}

                                    />

                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Fecha de confirmación
                                            </span>
                                        }
                                        id={'date_extra1'}
                                        onChange={(event) => this.change(event, "date_extra1", "date_extra1")}
                                        value={this.state.date_extra1}
                                        type={'date'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "date_extra1", "date_extra1", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Fecha de despacho
                                            </span>
                                        }
                                        id={'date_extra2'}
                                        value={this.state.date_extra2}
                                        type={'date'}
                                        onChange={(event) => this.change(event, "date_extra2", "date_extra2")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "date_extra2", "date_extra2", 3),

                                            fullWidth: true
                                        }}
                                    />

                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Estado
                                            </p>

                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'status'} id={'status'} onChange={(event) => this.change(event, "status", "status")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.statuss.map(c => {

                                                    var selected = false;
                                                    if (this.state.status === c['id']) {
                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>




                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Fuente
                                            </p>

                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'source'} id={'source'} onChange={(event) => this.change(event, "source", "source")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.sources.map(c => {

                                                    var selected = false;
                                                    if (this.state.source == c['id']) {
                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>

                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Usuario Mercado Libre
                                            </span>
                                        }
                                        id={'user_meli'}
                                        value={this.state.user_meli}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "user_meli", "user_meli")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "user_meli", "user_meli", 3),
                                            fullWidth: true
                                        }}

                                    />

                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>

                </GridItem>



                <GridItem xs={6} sm={6} md={6}>

                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <EditIcon />
                            </CardIcon>
                            <h4 className="card-icon-title">Datos de entrega</h4>
                        </CardHeader>
                        <CardBody className="edit-customer-form">
                            <GridContainer>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Direccion
                                            </span>
                                        }
                                        id={'delivery_address'}
                                        value={this.state.delivery_address}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "delivery_address", "delivery_address")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "delivery_address", "delivery_address", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        onChangeValue={this.onChangeValue}
                                        labelText={
                                            <span>
                                                Ciudad
                                            </span>
                                        }
                                        id={'delivery_city'}
                                        value={this.state.delivery_city}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "delivery_city", "delivery_city")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "delivery_city", "delivery_city", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Provincia
                                            </span>
                                        }
                                        id={'customer'}
                                        value={this.state.delivery_state}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "delivery_state", "delivery_state")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "delivery_state", "delivery_state", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Código postal
                                            </span>
                                        }
                                        id={'delivery_zipcode'}
                                        value={this.state.delivery_zipcode}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "delivery_zipcode", "delivery_zipcode")}
                                        formControlProps={{
                                            onChange: event => self.change(event, "delivery_zipcode", "delivery_zipcode", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        labelText={
                                            <span>
                                                Telefono
                                            </span>
                                        }
                                        onChange={(event) => this.change(event, "delivery_phone", "delivery_phone")}
                                        id={'delivery_phone'}
                                        value={this.state.delivery_phone}
                                        type={'text'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "delivery_phone", "length", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Forma pago entrega
                                            </p>

                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'shipping_payment'} id={'shipping_payment'} onChange={(event) => this.change(event, "shipping_payment", "shipping_payment")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.shipping_payments.map(c => {

                                                    var selected = false;
                                                    if (this.state.shipping_payment === c['id']) {

                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Quien retira
                                            </span>
                                        }
                                        id={'quien_retira'}
                                        value={this.state.quien_retira}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "quien_retira", "quien_retira")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "quien_retira", "quien_retira", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>
                                    <div>
                                        <p style={{ fontSize: 12, marginBottom: 10 }}>
                                            Donde retira
                                        </p>
                                        <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'donde_retira'} id={'donde_retira'} onChange={(event) => this.change(event, "donde_retira", "donde_retira")}
                                        >
                                            <option value=' ' selected> </option>

                                            {this.state.donde_retiras.map(c => {

                                                var selected = false;
                                                if (this.state.donde_retira == c['id']) {
                                                    return (
                                                        <option value={c['id']} selected>{c.name}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option value={c['id']}>{c.name}</option>
                                                    )

                                                }
                                            })}

                                        </select>
                                    </div>
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                DNI retira
                                            </span>
                                        }
                                        id={'dni_retira'}
                                        value={this.state.dni_retira}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "dni_retira", "dni_retira")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "dni_retira", "dni_retira", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                                <GridItem xs={3} sm={3} md={3}>
                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Empresa
                                            </p>
                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'shipping_company'} id={'shipping_company'} onChange={(event) => this.change(event, "shipping_company", "shipping_company")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.shippingCompanys.map(c => {

                                                    var selected = false;
                                                    if (this.state.shipping_company == c['id']) {
                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>
                                </GridItem>

                                {this.state.idv != null ?
                                    <GridContainer>
                                        <GridItem xs={4} sm={4} md={4} style={{ textAlign: 'center', marginTop: 10 }}>
                                            <Button
                                                key="close"
                                                aria-label="Close"
                                                color="warning"
                                                onClick={this.makeEtiqueta}>
                                                Generar etiqueta
                                            </Button>
                                        </GridItem>
                                        <GridItem xs={4} sm={4} md={4} style={{ textAlign: 'center', marginTop: 10 }}>
                                            <Button
                                                key="close"
                                                aria-label="Close"
                                                color="success"
                                                onClick={this.makeEtiquetaEnvio}>
                                                Generar etiqueta de envio
                                            </Button>
                                        </GridItem>
                                    </GridContainer>
                                    : <div />
                                }
                            </GridContainer>
                        </CardBody>
                    </Card>

                </GridItem>

                <GridItem xs={6} sm={6} md={6}>

                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <EditIcon />
                            </CardIcon>
                            <h4 className="card-icon-title">Datos cobro</h4>
                        </CardHeader>
                        <CardBody className="edit-customer-form">
                            <GridContainer>
                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        money={true}
                                        labelText={
                                            <span>
                                                Presupuesto original
                                            </span>
                                        }
                                        id={'budget_original'}
                                        value={this.state.budget_original}
                                        type={'numbewr'}
                                        editable={false}

                                        formControlProps={{
                                            onChange: event => self.change(event, "budget_original", "budget_original", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>


                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Nota presupuesto original
                                            </span>
                                        }
                                        id={'presupuesto_nota'}
                                        value={this.state.presupuesto_nota}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "presupuesto_nota", "presupuesto_nota")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "presupuesto_nota", "presupuesto_nota", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>





                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        money={true}
                                        labelText={
                                            <span>
                                                Adicional
                                            </span>
                                        }
                                        id={'additional'}
                                        value={this.state.additional}
                                        type={'number'}
                                        onChange={(event) => this.change(event, "additional", "additional")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "additional", "additional", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Nota Adicional
                                            </span>
                                        }
                                        id={'adicionales_nota'}
                                        value={this.state.adicionales_nota}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "adicionales_nota", "adicionales_nota")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "adicionales_nota", "adicionales_nota", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>





                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        money={true}
                                        labelText={
                                            <span>
                                                Saldo
                                            </span>
                                        }
                                        id={'saldo'}
                                        onChange={(event) => this.change(event, "saldo", "saldo")}
                                        value={this.state.saldo}
                                        disabled={true}
                                        type={'number'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "saldo", "saldo", 3),
                                            fullWidth: true
                                        }}

                                    />

                                </GridItem>





                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Nota Saldo
                                            </span>
                                        }
                                        id={'saldo_nota'}
                                        value={this.state.saldo_nota}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "saldo_nota", "saldo_nota")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "saldo_nota", "saldo_nota", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        money={true}
                                        labelText={
                                            <span>
                                                Envio
                                            </span>
                                        }
                                        id={'saldo'}
                                        onChange={(event) => this.change(event, "envio", "envio")}
                                        value={this.state.envio}
                                        type={'number'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "envio", "envio", 3),
                                            fullWidth: true
                                        }}

                                    />

                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Nota Envio
                                            </span>
                                        }
                                        id={'saldo_nota'}
                                        value={this.state.envio_nota}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "envio_nota", "envio_nota")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "envio_nota", "envio_nota", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        money={true}
                                        labelText={
                                            <span>
                                                Presupuesto total
                                            </span>
                                        }
                                        id={'budget_total'}
                                        disabled={true}
                                        value={this.state.budget_total}
                                        onChange={(event) => this.change(event, "budget_total", "budget_total")}
                                        type={'number'}
                                        formControlProps={{
                                            onChange: event => self.change(event, "budget_total", "length", 3),
                                            fullWidth: true
                                        }}

                                    />

                                </GridItem>


                                <GridItem xs={6} sm={6} md={6}>

                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        labelText={
                                            <span>
                                                Nota Presupuesto Total

                                            </span>
                                        }
                                        id={'presupuesto_total_nota'}
                                        value={this.state.presupuesto_total_nota}
                                        type={'text'}
                                        onChange={(event) => this.change(event, "presupuesto_total_nota", "presupuesto_total_nota")}

                                        formControlProps={{
                                            onChange: event => self.change(event, "presupuesto_total_nota", "presupuesto_total_nota", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>

                                <GridItem xs={12} sm={12} md={12}>


                                    <FormControl style={{ width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: 12, marginBottom: 10 }}>
                                                Vendedores
                                            </p>

                                            <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'user'} id={'user'} onChange={(event) => this.change(event, "user", "user")}
                                            >
                                                <option value=' ' selected> </option>

                                                {this.state.userProfiles.map(c => {

                                                    var selected = false;
                                                    if (this.state.user == c['id']) {
                                                        return (
                                                            <option value={c['id']} selected>{c.name}</option>
                                                        )
                                                    } else {
                                                        return (
                                                            <option value={c['id']}>{c.name}</option>
                                                        )

                                                    }
                                                })}

                                            </select>
                                        </div>
                                    </FormControl>


                                </GridItem>
                                <GridItem xs={6} sm={6} md={6} style={{ marginTop: 20 }}>
                                    <Button color="success" onClick={() => this.showPagos()}>Datos cobros</Button>
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6} style={{ marginTop: 20 }}>
                                    {this.state.idv != null ?
                                        <Button color="success" onClick={() => this.showDespacho()}>Despacho</Button>
                                        : <div />}
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>

                </GridItem>



                <GridItem xs={12} sm={12} md={12}>

                    <Card>
                        <CardHeader color="success" icon>
                            <CardIcon color="success">
                                <EditIcon />
                            </CardIcon>
                            <h4 className="card-icon-title">Items</h4>
                        </CardHeader>
                        <CardBody className="edit-customer-form">
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <Table
                                        filtrable={false}
                                        tableHeaderColor="primary"
                                        tableHead={[
                                            { "Header": "Tela", "accessor": "cloth1_name" },
                                            { "Header": "Tela 2", "accessor": "cloth2_name" },
                                            { "Header": "Color", "accessor": "color1_name" },
                                            { "Header": "Color 2", "accessor": "color2_name" },
                                            { "Header": "Doble", "accessor": "is_double" },
                                            { "Header": "Zocalo", "accessor": "plinth1_name" },
                                            { "Header": "Cadena", "accessor": "chain1_name" },
                                            { "Header": "Cantidad", "accessor": "quantity" },
                                            { "Header": "Ancho final", "accessor": "final_width" },
                                            { "Header": "Alto final", "accessor": "final_height" },
                                            { "Header": "Final sistema", "accessor": "final_width_system" },
                                            { "Header": "Acciones", "accessor": "actions" }
                                        ]}
                                        tableData={this.state.items
                                        }
                                        maxHeight={400}
                                        colorsColls={["primary"]}
                                    />
                                </GridItem>
                                <Button color="success" onClick={() => this.openNew()}>Agregar Item</Button>
                            </GridContainer>
                        </CardBody>

                        <GridItem xs={12} sm={12} md={12}>

                            <Card>
                                <CardHeader color="success" icon>
                                    <CardIcon color="success">
                                        <EditIcon />
                                    </CardIcon>
                                    <h4 className="card-icon-title">Observaciones</h4>
                                </CardHeader>
                                <CardBody className="edit-customer-form">
                                    <GridContainer>
                                        <GridItem xs={6} sm={6} md={6}>

                                            <CustomInput
                                                success={this.state.lastnameState === "success"}
                                                error={this.state.lastnameState === "error"}
                                                labelText={
                                                    <span>
                                                        Notas cliente
                                                    </span>
                                                }
                                                id={'customer_note'}
                                                value={this.state.customer_note}
                                                type={'text'}
                                                onChange={(event) => this.change(event, "customer_note", "customer_note")}
                                                formControlProps={{
                                                    onChange: event => self.change(event, "customer_note", "customer_note", 3),
                                                    fullWidth: true
                                                }}

                                            />



                                        </GridItem>
                                        <GridItem xs={6} sm={6} md={6}>

                                            <CustomInput
                                                success={this.state.lastnameState === "success"}
                                                error={this.state.lastnameState === "error"}
                                                labelText={
                                                    <span>
                                                        Notas adicinoales
                                                    </span>
                                                }
                                                id={'adicional_note'}
                                                value={this.state.adicional_note}
                                                type={'text'}
                                                onChange={(event) => this.change(event, "adicional_note", "adicional_note")}

                                                formControlProps={{
                                                    onChange: event => self.change(event, "adicional_note", "adicional_note", 3),
                                                    fullWidth: true
                                                }}

                                            />



                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                            </Card>
                        </GridItem>

                        <GridContainer style={{ marginTop: 30 }}>
                            <GridItem xs={5} sm={5} md={5}>
                            </GridItem>
                            <GridItem xs={2} sm={2} md={2}>
                                {this.state.delete ?
                                    <Button
                                        key="close"
                                        aria-label="Close"
                                        color="danger"
                                        onClick={this.deleteOrder}>
                                        ELIMINAR ORDEN
                                    </Button>
                                    : <Button
                                        key="close"
                                        aria-label="Close"
                                        color="rose"
                                        onClick={this.saveOrder}>
                                        GUARDAR ORDEN
                                    </Button>
                                }
                            </GridItem>
                        </GridContainer>
                    </Card>
                </GridItem>


                <Dialog
                    fullWidth
                    maxWidth={this.state.maxWidth || 'md'}
                    open={this.state.addItemOpen}
                >
                    <DialogTitle className="create-address-title">
                        Agregar Item
                    </DialogTitle>
                    <DialogContent style={{ height: '80%' }}>
                        <GridContainer>

                            {renderSelector}
                            {nameTemplate}

                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Tela 1
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'cloth1'} id={'cloth1'} onChange={(event) => this.changeItem(event, "cloth1", "cloth1")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.cloths.map(c => {

                                        var selected = false;
                                        if (this.state.item.cloth1 && this.state.item.cloth1['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Tela 1
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'cloth2'} id={'cloth2'} onChange={(event) => this.changeItem(event, "cloth2", "cloth2")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.cloths.map(c => {

                                        var selected = false;
                                        if (this.state.item.cloth2 && this.state.item.cloth2['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>


                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>


                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Color 1
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'color1'} id={'color1'} onChange={(event) => this.changeItem(event, "color1", "cloth2")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.colors1.map(c => {

                                        var selected = false;
                                        if (this.state.item.color1 && this.state.item.color1['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Color 2
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'color2'} id={'color2'} onChange={(event) => this.changeItem(event, "color2", "color2")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.colors2.map(c => {

                                        var selected = false;
                                        if (this.state.item.color2 && this.state.item.color2['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Caida 1
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'drop1'} id={'drop1'} onChange={(event) => this.changeItem(event, "drop1", "drop1")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.drops.map(c => {

                                        var selected = false;
                                        if (this.state.item.drop1 && this.state.item.drop1['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Caida 2
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'drop2'} id={'drop2'} onChange={(event) => this.changeItem(event, "drop2", "drop2")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.drops.map(c => {

                                        var selected = false;
                                        if (this.state.item.drop2 && this.state.item.drop2['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>


                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Cadena 1
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'chain1'} id={'chain1'} onChange={(event) => this.changeItem(event, "chain1", "chain1")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.chains.map(c => {

                                        var selected = false;
                                        if (this.state.item.chain1 && this.state.item.chain1['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Cadena 2
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'chain2'} id={'chain2'} onChange={(event) => this.changeItem(event, "chain2", "chain2")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.chains.map(c => {

                                        var selected = false;
                                        if (this.state.item.chain2 && this.state.item.chain2['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Zocalo 1
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'plinth1'} id={'plinth1'} onChange={(event) => this.changeItem(event, "plinth1", "plinth1")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.plinths.map(c => {

                                        var selected = false;
                                        if (this.state.item.plinth1 && this.state.item.plinth1['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>

                            </GridItem>
                            <GridItem xs={6} sm={6} md={6}>

                                <p style={{ fontSize: 12, marginBottom: 10 }}>
                                    Zocalo 2
                                </p>

                                <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'plinth2'} id={'plinth2'} onChange={(event) => this.changeItem(event, "plinth2", "plinth2")}
                                >
                                    <option value=' ' selected> </option>

                                    {this.state.plinths.map(c => {

                                        var selected = false;
                                        if (this.state.item.plinth2 && this.state.item.plinth2['id'] == c['id']) {
                                            return (
                                                <option value={c['id']} selected>{c.name}</option>
                                            )
                                        } else {
                                            return (
                                                <option value={c['id']}>{c.name}</option>
                                            )

                                        }
                                    })}

                                </select>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Cantidad
                                        </span>
                                    }
                                    id={'quantity'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    value={this.state.item.quantity}
                                    type={'number'}
                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "quantity", "quantity", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Original Ancho
                                        </span>
                                    }
                                    id={'original_width'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    value={this.state.item.original_width}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "original_width", "original_width", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Original Alto
                                        </span>
                                    }
                                    id={'original_height'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}
                                    value={this.state.item.original_height}
                                    type={'number'}
                                    onChange={(event) => this.changeItem(event, "original_height", "original_height")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "original_height", "original_height", 3),
                                        fullWidth: true
                                    }}
                                />

                            </GridItem>

                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Final Ancho
                                        </span>
                                    }
                                    id={'final_width'}
                                    value={this.state.item.final_width}
                                    type={'number'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}
                                    disabled={true}
                                    onChange={(event) => this.changeItem(event, "final_width", "final_width")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "final_width", "final_width", 3),
                                        fullWidth: true
                                    }}
                                />

                            </GridItem>


                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Final Alto
                                        </span>
                                    }
                                    id={'final_height'}
                                    value={this.state.item.final_height}
                                    type={'number'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    disabled={true}

                                    onChange={(event) => this.changeItem(event, "final_height", "final_height")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "final_height", "final_height", 3),
                                        fullWidth: true
                                    }}
                                />

                            </GridItem>

                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Final Ancho sistema
                                        </span>
                                    }
                                    id={'final_width_system'}
                                    value={this.state.item.final_width_system}
                                    type={'number'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    disabled={true}

                                    onChange={(event) => this.changeItem(event, "final_width_system", "final_width_system")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "final_width_system", "final_width_system", 3),
                                        fullWidth: true
                                    }}
                                />

                            </GridItem>



                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Ancho
                                        </span>
                                    }
                                    id={'width'}
                                    value={this.state.item.width}
                                    type={'number'}
                                    onChange={(event) => this.changeItem(event, "width", "width")}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "width", "width", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>

                            <GridItem xs={8} sm={8} md={8}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Importante Ancho
                                        </span>
                                    }
                                    id={'width'}
                                    value={this.state.item.width_importante}
                                    type={'text'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    onChange={(event) => this.changeItem(event, "width_importante", "width_importante")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "width_importante", "width_importante", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>


                            <GridItem xs={4} sm={4} md={4}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Alto
                                        </span>
                                    }
                                    id={'height'}
                                    value={this.state.item.height}
                                    type={'number'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}

                                    onChange={(event) => this.changeItem(event, "height", "height")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "height", "height", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>

                            <GridItem xs={8} sm={8} md={8}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Importante Alto
                                        </span>
                                    }

                                    id={'height_importante'}
                                    labelProps={{ style: { fontSize: 19, color: 'black', fontWeight: 'bold' } }}
                                    value={this.state.item.height_importante}
                                    type={'text'}
                                    onChange={(event) => this.changeItem(event, "height_importante", "height_importante")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "height_importante", "height_importante", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>


                            <GridItem xs={12} sm={12} md={12}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Notas
                                        </span>
                                    }
                                    id={'notes'}

                                    value={this.state.item.notes}
                                    type={'text'}
                                    onChange={(event) => this.changeItem(event, "notes", "notes")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "notes", "notes", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>

                            <GridItem xs={12} sm={12} md={12}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Notas exportación Excel
                                        </span>
                                    }
                                    id={'notes_importante'}
                                    value={this.state.item.notes_importante}
                                    type={'text'}
                                    fullWidth

                                    onChange={(event) => this.changeItem(event, "notes_importante", "notes_importante")}

                                    formControlProps={{
                                        onChange: event => self.changeItem(event, "notes_importante", "notes_importante", 3),
                                        fullWidth: true
                                    }}
                                />
                            </GridItem>

                        </GridContainer>
                    </DialogContent>

                    <footer>
                        <GridContainer>

                            <GridItem xs={2} sm={2} md={2}>

                                <Button color="success" onClick={() => this.saveItem()}>Guardar item</Button>

                            </GridItem>
                            <GridItem xs={8} sm={8} md={8}>


                            </GridItem>
                            <GridItem xs={2} sm={2} md={2}>

                                <Button
                                    key="close"
                                    aria-label="Close"
                                    color="danger"
                                    onClick={this.closeNew}>
                                    Cerrar
                                </Button>
                            </GridItem>
                        </GridContainer>
                    </footer>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth={this.state.maxWidth || 'md'}
                    open={this.state.showPagos}
                >
                    <DialogTitle className="create-address-title">
                        Pagos
                    </DialogTitle>
                    <DialogContent style={{ height: '80%' }}>
                        <GridContainer>


                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Pago
                                        </span>
                                    }
                                    id={'payment'}
                                    value={this.state.payment}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment", "payment", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>
                                <FormControl style={{ width: '100%' }}>
                                    <div>
                                        <p style={{ fontSize: 12, marginBottom: 10 }}>
                                            Tipo de pago
                                        </p>

                                        <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'payment_type'} id={'payment_type'} onChange={(event) => this.change(event, "payment_type", "payment_type")}
                                        >
                                            <option value=' ' selected> </option>

                                            {this.state.payment_types.map(c => {

                                                var selected = false;
                                                if (this.state.payment_type == c['id']) {
                                                    return (
                                                        <option value={c['id']} selected>{c.name}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option value={c['id']}>{c.name}</option>
                                                    )

                                                }
                                            })}

                                        </select>
                                    </div>
                                </FormControl>
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    onSelect={this.props.onSelect}
                                    labelText={
                                        <span>
                                            Fecha de pago
                                        </span>
                                    }
                                    id={'payment_date'}
                                    onChange={(event) => this.change(event, "payment_date", "payment_date")}
                                    value={this.state.payment_date}
                                    type={'date'}
                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_date", "payment_date", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Número de operación
                                        </span>
                                    }
                                    id={'payment_op'}
                                    value={this.state.payment_op}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_op", "payment_op", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>





                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Pago
                                        </span>
                                    }
                                    id={'payment1'}
                                    value={this.state.payment1}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment1", "payment1", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>
                                <FormControl style={{ width: '100%' }}>
                                    <div>
                                        <p style={{ fontSize: 12, marginBottom: 10 }}>
                                            Tipo de pago
                                        </p>

                                        <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'payment_type1'} id={'payment_type1'} onChange={(event) => this.change(event, "payment_type1", "payment_type1")}
                                        >
                                            <option value=' ' selected> </option>

                                            {this.state.payment_types.map(c => {

                                                var selected = false;
                                                if (this.state.payment_type1 == c['id']) {
                                                    return (
                                                        <option value={c['id']} selected>{c.name}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option value={c['id']}>{c.name}</option>
                                                    )

                                                }
                                            })}

                                        </select>
                                    </div>
                                </FormControl>
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    onSelect={this.props.onSelect}
                                    labelText={
                                        <span>
                                            Fecha de pago
                                        </span>
                                    }
                                    id={'payment_date1'}
                                    onChange={(event) => this.change(event, "payment_date1", "payment_date1")}
                                    value={this.state.payment_date1}
                                    type={'date'}
                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_date1", "payment_date1", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Número de operación
                                        </span>
                                    }
                                    id={'payment_op1'}
                                    value={this.state.payment_op1}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_op1", "payment_op1", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>

                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Pago
                                        </span>
                                    }
                                    id={'payment2'}
                                    value={this.state.payment2}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment2", "payment2", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>
                                <FormControl style={{ width: '100%' }}>
                                    <div>
                                        <p style={{ fontSize: 12, marginBottom: 10 }}>
                                            Tipo de pago
                                        </p>

                                        <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'payment_type2'} id={'payment_type2'} onChange={(event) => this.change(event, "payment_type2", "payment_type2")}
                                        >
                                            <option value=' ' selected> </option>

                                            {this.state.payment_types.map(c => {

                                                var selected = false;
                                                if (this.state.payment_type2 == c['id']) {
                                                    return (
                                                        <option value={c['id']} selected>{c.name}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option value={c['id']}>{c.name}</option>
                                                    )

                                                }
                                            })}

                                        </select>
                                    </div>
                                </FormControl>
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    onSelect={this.props.onSelect}
                                    labelText={
                                        <span>
                                            Fecha de pago
                                        </span>
                                    }
                                    id={'payment_date2'}
                                    onChange={(event) => this.change(event, "payment_date2", "payment_date2")}
                                    value={this.state.payment_date2}
                                    type={'date'}
                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_date2", "payment_date2", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Número de operación
                                        </span>
                                    }
                                    id={'payment_op2'}
                                    value={this.state.payment_op2}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_op2", "payment_op2", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>

                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Pago
                                        </span>
                                    }
                                    id={'payment3'}
                                    value={this.state.payment3}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment3", "payment3", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>
                                <FormControl style={{ width: '100%' }}>
                                    <div>
                                        <p style={{ fontSize: 12, marginBottom: 10 }}>
                                            Tipo de pago
                                        </p>

                                        <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'payment_type3'} id={'payment_type3'} onChange={(event) => this.change(event, "payment_type3", "payment_type3")}
                                        >
                                            <option value=' ' selected> </option>

                                            {this.state.payment_types.map(c => {

                                                var selected = false;
                                                if (this.state.payment_type3 == c['id']) {
                                                    return (
                                                        <option value={c['id']} selected>{c.name}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option value={c['id']}>{c.name}</option>
                                                    )

                                                }
                                            })}

                                        </select>
                                    </div>
                                </FormControl>
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    onSelect={this.props.onSelect}
                                    labelText={
                                        <span>
                                            Fecha de pago
                                        </span>
                                    }
                                    id={'payment_date3'}
                                    onChange={(event) => this.change(event, "payment_date3", "payment_date3")}
                                    value={this.state.payment_date3}
                                    type={'date'}
                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_date3", "payment_date3", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Número de operación
                                        </span>
                                    }
                                    id={'payment_op3'}
                                    value={this.state.payment_op3}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_op3", "payment_op3", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>


                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Pago
                                        </span>
                                    }
                                    id={'payment4'}
                                    value={this.state.payment4}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment4", "payment4", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>
                                <FormControl style={{ width: '100%' }}>
                                    <div>
                                        <p style={{ fontSize: 12, marginBottom: 10 }}>
                                            Tipo de pago
                                        </p>

                                        <select className="MuiSelect-root-349" style={{ width: '100%' }} name={'payment_type4'} id={'payment_type4'} onChange={(event) => this.change(event, "payment_type4", "payment_type4")}
                                        >
                                            <option value=' ' selected> </option>

                                            {this.state.payment_types.map(c => {

                                                var selected = false;
                                                if (this.state.payment_type4 == c['id']) {
                                                    return (
                                                        <option value={c['id']} selected>{c.name}</option>
                                                    )
                                                } else {
                                                    return (
                                                        <option value={c['id']}>{c.name}</option>
                                                    )

                                                }
                                            })}

                                        </select>
                                    </div>
                                </FormControl>
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    onSelect={this.props.onSelect}
                                    labelText={
                                        <span>
                                            Fecha de pago
                                        </span>
                                    }
                                    id={'payment_date4'}
                                    onChange={(event) => this.change(event, "payment_date4", "payment_date4")}
                                    value={this.state.payment_date4}
                                    type={'date'}
                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_date4", "payment_date4", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Número de operación
                                        </span>
                                    }
                                    id={'payment_op4'}
                                    value={this.state.payment_op4}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_op4", "payment_op4", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Notas de pago
                                        </span>
                                    }
                                    id={'payment_note'}
                                    value={this.state.payment_note}
                                    type={'text'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "payment_note", "payment_note", 3),
                                        fullWidth: true
                                    }}

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
                                    onClick={this.showPagos}>
                                    Cerrar
                                </Button>
                            </GridItem>
                        </GridContainer>
                    </footer>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth={this.state.maxWidth || 'md'}
                    open={this.state.showDespacho}
                >
                    <DialogTitle className="create-address-title">
                        Despacho
                    </DialogTitle>
                    <DialogContent style={{ height: '80%' }}>
                        <GridContainer>



                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    onSelect={this.props.onSelect}
                                    labelText={
                                        <span>
                                            Fecha de envio
                                        </span>
                                    }
                                    id={'shipping_date'}
                                    onChange={(event) => this.change(event, "shipping_date", "shipping_date")}
                                    value={this.state.shipping_date}
                                    type={'date'}
                                    formControlProps={{
                                        onChange: event => self.change(event, "shipping_date", "shipping_date", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3}>

                                <CustomInput
                                    success={this.state.lastnameState === "success"}
                                    error={this.state.lastnameState === "error"}
                                    labelText={
                                        <span>
                                            Número de despacho
                                        </span>
                                    }
                                    id={'shipping_number'}
                                    value={this.state.shipping_number}
                                    type={'number'}

                                    formControlProps={{
                                        onChange: event => self.change(event, "shipping_number", "shipping_number", 3),
                                        fullWidth: true
                                    }}

                                />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <div id='shiping_code'></div>
                            </GridItem>

                        </GridContainer>
                    </DialogContent>

                    <footer>
                        <GridContainer>

                            {/*
                            <GridItem xs={2} sm={2} md={2}>
                                <Button
                                    key="close"
                                    aria-label="Close"
                                    color="success"
                                    onClick={this.saveDespachos}>
                                    Guardar
                                </Button>
                            </GridItem>
                                */}
                            <GridItem xs={4} sm={4} md={4} style={{ textAlign: 'center' }}>
                                <Button
                                    key="close"
                                    aria-label="Close"
                                    color="danger"
                                    onClick={this.showDespacho}>
                                    Cerrar
                                </Button>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} style={{ textAlign: 'center' }}>
                                <Button
                                    key="close"
                                    aria-label="Close"
                                    color="primary"
                                    onClick={this.shippingCompanyLoad}>
                                    Mostrar texto
                                </Button>
                            </GridItem>

                        </GridContainer>
                    </footer>
                </Dialog>

                {this.state.showEtiqueta ?
                    <Dialog
                        fullWidth
                        maxWidth={this.state.maxWidth || 'md'}
                        open={this.state.showEtiqueta}
                    >
                        <DialogTitle className="create-address-title">
                            Etiqueta
                        </DialogTitle>
                        <DialogContent style={{ height: '80%' }}>
                            <GridContainer>
                                <div id='etiqueta_content' />

                            </GridContainer>
                        </DialogContent>

                        <footer>
                            <GridContainer>

                                <GridItem xs={3} sm={3} md={3}>

                                </GridItem>
                                <GridItem xs={2} sm={2} md={2}>
                                    <Button
                                        key="close"
                                        aria-label="Close"
                                        color="success"
                                        onClick={() => this.setState({ showEtiqueta: false })}>
                                        Cerrar
                                    </Button>
                                </GridItem>
                                <GridItem xs={2} sm={2} md={2}>
                                    <Button
                                        key="close"
                                        aria-label="Close"
                                        color="primary"
                                        onClick={this.printEtiquet}>
                                        Imprimir
                                    </Button>
                                </GridItem>

                            </GridContainer>
                        </footer>
                    </Dialog>
                    : <div />}
            </GridContainer >
        );
    }
}



export default withStyles(styles)(NewOrder);
