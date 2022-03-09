import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import customInputStyle from "assets/jss/material-dashboard-pro-react/components/customInputStyle.jsx";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

function CustomInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    helpText,
    select,
    selectValues,
    onSelect,
    onChangeValue,
    money
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
    [classes.whiteUnderline]: white
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white
  });
  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  } else {
    formControlClasses = classes.formControl;
  }
  var helpTextClasses = classNames({
    [classes.labelRootError]: error,
    [classes.labelRootSuccess]: success && !error
  });


  /*<Input
  classes={{
    input: inputClasses,
    root: marginTop,
    disabled: classes.disabled,
    underline: underlineClasses
  }}
  id={id}
  value={props.value}
  type={props.type}
  {...inputProps}
  />*/



  var hasselect = false;
  var value = false;
  console.log("aaa" + id);

  if (onSelect && onSelect.hasOwnProperty(id)) {
    hasselect = true;
  }
  if (props.value === 'true' || props.value === true) {
    value = true;
  }

  var valueid = null;
  if (props.value) {
    valueid = props.value;
  }

  return (

    <FormControl {...formControlProps} className={formControlClasses}>
      {labelText !== undefined ? (
        <InputLabel
          className={classes.labelRoot + " " + labelClasses}
          htmlFor={id}
          {...labelProps}

        >
          {labelText}
        </InputLabel>
      ) : null}

      {hasselect == true ?
        <div style={{width: '100%'}}>
          <p style={{ fontSize: 12, marginBottom: 10 }}>
            &nbsp;
          </p>

          <select className="MuiSelect-root-349" style={{ width: '100%' }} name={id} id={id} onChange={onChangeValue}>
            <option value=' ' selected> </option>

            {onSelect[id].map(c => {

              var selected = false;
              if (valueid == c['id']) {
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

        :
        <div style={{width: '100%'}}>
          {money && '$'}
          <Input
            style={{width: '100%'}}
            classes={{
              input: inputClasses,
              root: marginTop,
              disabled: classes.disabled,
              underline: underlineClasses
            }}
            id={id}
            value={props.value}
            checked
            disabled={props.disabled}
            type={props.type}
            {...inputProps}
          />
        </div>


      }

      {helpText !== undefined ? (
        <FormHelperText id={id + "-text"} className={helpTextClasses}>
          {helpText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
  helpText: PropTypes.node,
  select: PropTypes.bool,
  money: PropTypes.bool
};

export default withStyles(customInputStyle)(CustomInput);
