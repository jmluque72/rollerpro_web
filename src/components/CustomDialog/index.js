import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Button from '../CustomButtons/Button';
import './CustomDialog.css';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";


class CustomDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            fields: [],
        }
    }

    componentWillReceiveProps(next) {
        if (next.open) {
            this.setState({
                open: next.open
            })
        }
        if (next.fields) {
            this.setState({
                fields: next.fields
            })
        }
        if (next.data) {
            var str = this.state;
            var news = Object.assign({}, str, next.data);
            news['open'] = true;
            this.state = news;
        }
    }

    handleSuccess = () => {
        this.props.onSucess();
    }

    handleClose = () => {
        this.setState({
            open: false
        });
        this.props.onClose();
    }


    change(event, stateName, type, stateNameEqualTo) {
        if (event.target.type === 'checkbox') {
            this.setState({ [stateName]: event.target.checked });
            this.props.data[stateName] = event.target.checked;
        } else {
            this.setState({ [stateName]: event.target.value });
            this.props.data[stateName] = event.target.value;

        }
    }

    onChangeValue = (item, value) => {

        this.setState({ [item.target.name]: item.target.value });
        this.props.data[item.target.name] = item.target.value;

    }


    render() {
        return (
            <Dialog
                fullWidth
                maxWidth={this.state.maxWidth || 'md'}
                open={true}
            >
                <DialogTitle className="create-address-title">
                    {this.props.title}
                </DialogTitle>

                <DialogContent style={{ height: '100%' }}>
                    <GridContainer>
                        {this.props.fields.map(c => {
                            console.log(c.name);
                            return (
                                <GridItem xs={6} sm={6} md={6}>
                                    <CustomInput
                                        success={this.state.lastnameState === "success"}
                                        error={this.state.lastnameState === "error"}
                                        onSelect={this.props.onSelect}
                                        onChangeValue={this.onChangeValue}
                                        labelText={
                                            <span>
                                                {c.Header}
                                            </span>
                                        }
                                        id={c.name}
                                        value={this.props.data[c.name]}
                                        type={c.type}
                                        formControlProps={{
                                            onChange: event => this.change(event, c.name, "length", 3),
                                            fullWidth: true
                                        }}

                                    />
                                </GridItem>
                            );
                        })}
                    </GridContainer>
                    <GridContainer style={{ marginTop: 20 }}>
                        <GridItem xs={10} sm={10} md={10}>
                            <Button
                                key="close"
                                aria-label="Close"
                                color="success"
                                onClick={this.handleSuccess}>
                                Guardar cambios
                                </Button>
                        </GridItem>

                        <GridItem xs={2} sm={2} md={2}>

                            <Button
                                key="close"
                                aria-label="Close"
                                color="danger"
                                onClick={this.handleClose}>
                                Cerrar
                            </Button>
                        </GridItem>

                    </GridContainer>
                </DialogContent>
                <footer>



                </footer>
            </Dialog>
        )
    }
}

CustomDialog.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,
    fields: PropTypes.array,
    data: PropTypes.array,

    maxWidth: PropTypes.string,
}

export default CustomDialog;