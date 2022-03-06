import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import ReactTable from 'react-table'

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import tableStyle from "assets/jss/material-dashboard-pro-react/components/tableStyle";

function filterCaseInsensitive(filter, row) {  
	const id = filter.pivotId || filter.id;
	return (
		row[id] !== undefined ?
			String(row[id]).toLowerCase().startsWith(filter.value.toLowerCase())
		:
			false
	);
}

function CustomTable({ ...props }) {
  const {
    classes,
    tableHead,
    tableData,
    tableHeaderColor,
    hover,
    colorsColls,
    coloredColls,
    customCellClasses,
    customClassesForCells,
    striped,
    tableShopping,
    customHeadCellClasses,
    customHeadClassesForCells
  } = props;
  return (
    <div className={classes.tableResponsive} style={{ maxHeight: props.maxHeight, maxWidth: '100%'}}>
      <ReactTable
        data={props.tableData}
        sortable={true}
        filterable={true}
        pageSizeOptions={props.pageSizeOptions || [5, 10, 20, 25, 50, 75, 100, 125]}
        defaultPageSize={props.defaultPageSize}
        showPaginationTop={props.showPaginationTop}
        showPaginationBottom={props.showPaginationBottom}
        columns={props.tableHead}
        defaultFilterMethod={filterCaseInsensitive}

        />
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
  hover: false,
  colorsColls: [],
  coloredColls: [],
  striped: false,
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  // Of(PropTypes.arrayOf(PropTypes.node)) || Of(PropTypes.object),
  tableData: PropTypes.array,
  hover: PropTypes.bool,
  coloredColls: PropTypes.arrayOf(PropTypes.number),
  // Of(["warning","primary","danger","success","info","rose","gray"]) - colorsColls
  colorsColls: PropTypes.array,
  customCellClasses: PropTypes.arrayOf(PropTypes.string),
  customClassesForCells: PropTypes.arrayOf(PropTypes.number),
  customHeadCellClasses: PropTypes.arrayOf(PropTypes.string),
  customHeadClassesForCells: PropTypes.arrayOf(PropTypes.number),
  striped: PropTypes.bool,
  // this will cause some changes in font
  tableShopping: PropTypes.bool
};

export default withStyles(tableStyle)(CustomTable);
