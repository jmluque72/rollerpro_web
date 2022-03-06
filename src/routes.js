
import GenericServlet from "./views/Components/GenericServlet.jsx";

import NewOrder from "./views/Components/NewOrder.jsx";
import CUSTOMER from "@material-ui/icons/DateRange";
import ORDER from "@material-ui/icons/DateRange";
import LINES from "@material-ui/icons/DateRange";



// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";

import WidgetsIcon from "@material-ui/icons/Widgets";

var dashRoutes = [

  {
    path: "/customer",
    name: "Clientes",
    rtlName: "CUSTOMER",
    icon: CUSTOMER,
    component: GenericServlet,
    layout: "/admin"
  },
  {
    path: "/order",
    name: "Ordenes",
    rtlName: "ORDERS",
    icon: ORDER,
    component: GenericServlet,
    layout: "/admin"

  },

  {
    path: '/new-order',
    name: 'Crear orden',
    mini: '',
    component: NewOrder,
    rtlName: "ORDER_NEW",
    icon: LINES,
    layout: "/admin"

  },
  
  {
    collapse: true,
    name: 'Maestros',
    rtlName: '',
    mini: 'MA',
    role: 'admin',
    authority:'maestros',
    views: [
      {
        path: '/color',
        name: 'Color',
        mini: '',
        rtlName: "الرسوم البيانية",
        inset: 40,
        role: 'admin',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_color'
      },
      
      {
        path: '/chain',
        name: 'Cadena',
        mini: '',
        inset: 40,
        role: 'admin',
        rtlName: '',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_chain'
      },
      {
        path: '/plinth',
        name: 'Zocalo',
        mini: '',
        inset: 40,
        rtlName: '',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_plinth'
      },
      {
        path: '/drop',
        name: 'Caida',
        mini: '',
        inset: 40,
        rtlName: '',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_drop'
      },
      {
        path: '/cloth',
        name: 'Tela',
        mini: '',
        inset: 40,
        rtlName: '',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_shipping'
      },
      {
        path: '/source',
        name: 'Fuente',
        mini: '',
        inset: 40,
        rtlName: '',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_source'
      },

      {
        path: '/invoicetype',
        name: 'Tipo de documentos',
        mini: '',
        inset: 40,
        rtlName: '',
        component: GenericServlet,
        layout: "/admin",
        enabled: true,
        authority:'menu_source'
      },

    
     


  
    ],
  },
  
];
export default dashRoutes;
