import React from 'react';
import {FormFeedback, FormGroup, Input} from "reactstrap";
import {Field} from "redux-form";

const renderField = ({input, label, meta: {touched, error}}) => (
  <FormGroup>
    <Input size="lg" placeholder={label} valid={error ? false : null} {...input}/>
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
);

export default () => (
  <Field
    name="name"
    label="Insert name of your project"
    component={renderField}
  />
);
