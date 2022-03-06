import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GridItem from '../Grid/GridItem';
import GridContainer from '../Grid/GridContainer';
import CustomInput from '../CustomInput/CustomInput';
import moment from 'moment';
import './DateInput.css';

class DateInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            dateState: '',
            shrink: false,
        }
    }

    componentDidMount() {
        if (this.props.value && this.props.value !== '') {
            this.setState({
                shrink: true
            })
        }

        if (this.props.invalid) {
            this.setState({ dateState: "error" });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value && this.props.value !== '') {
            this.setState({
                shrink: true
            })
        }

        if (this.props.invalid && prevProps.invalid !== this.props.invalid) {
            this.setState({ dateState: "error" });
        }
    }

    change(value) {
        if (this.props.disabled) {
            return
        }
        if (value && value.format) {
            this.props.onChangeValue(`${value.format('YYYY-MM-DD')}T00:00:00.000`)
            this.setState({
                dateState: "success",
                shrink: true,
            })
        }
    }
    
    handleBlur(value) {
        let momentValue = moment(value);
        if (momentValue.isValid()) {
            //this.props.onChangeValue(`${momentValue.format('YYYY-MM-DD')}T00:00:00.000`)
            this.setState({
                dateState: "success",
                shrink: true,
            })
        }
    }

    render() {
        return (
            <GridContainer className="date-input">
            <GridItem xs={12} sm={this.props.sm || 7}>
            <CustomInput
                dateShrink={this.state.shrink}
                labelText={this.props.text}
                helpText={this.props.errorText}
                error={this.state['dateState'] === "error" || this.props.error}
                formControlProps={{
                    fullWidth: true
                }}
                minDate={this.props.minDate}
                closeOnSelect={true}
                disabled={this.props.disabled}
                dateValue={this.props.value ? moment.utc(this.props.value).format('DD/MM/YYYY') : this.props.value}
                type="date"
                min={this.props.min}
                max={this.props.max}
                time={false}
                onChange={event =>
                    this.change(event)}
                onBlur={event =>
                    this.handleBlur(event)}
                inputProps={{
                    disabled: this.props.disabled,
                }}
                className={this.props.disabled ? 'disabled': ''}
            />
            </GridItem>
            </GridContainer>
        )
    }
}

DateInput.propTypes = {
    text: PropTypes.string,
    value: PropTypes.any,
    onChangeValue: PropTypes.func,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    erroText: PropTypes.string,
    minDate: PropTypes.bool,
    min: PropTypes.string,
    max: PropTypes.string,
    sm: PropTypes.number,
}

export default DateInput;