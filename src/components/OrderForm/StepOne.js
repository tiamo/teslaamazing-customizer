import React, {Component} from 'react';
import {FormFeedback, FormGroup, Input} from "reactstrap";

export default class StepOne extends Component {

  constructor(props) {
    super(props);
    let value = this.props.getStore().name || "";
    this.state = {
      valid: value !== '' ? true : null,
      error: null,
      value: value
    };
  }

  validate() {
    if (this.state.value === "") {
      this.setState({valid: false, error: 'Please enter the name of your project.'});
    }
    this.props.updateStore({
      name: this.state.value
    });
    return this.state.valid;
  };

  handleChange = e => {
    let state = {
      value: e.target.value,
      valid: e.target.value !== '',
      error: ''
    };
    this.setState(state);
  };

  render() {
    return (
      <FormGroup>
        <Input tabIndex="99"
               size="lg"
               ref="input"
               valid={this.state.valid}
               placeholder="Insert name of your project"
               defaultValue={this.state.value}
               onChange={this.handleChange}/>
        <FormFeedback>{this.state.error}</FormFeedback>
      </FormGroup>
    );
  }
}
