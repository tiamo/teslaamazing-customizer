import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Modal, ModalBody} from 'reactstrap';
import {connect} from "react-redux";
import {reduxForm, SubmissionError} from "redux-form";

import {nextStep, prevStep, resetPreview} from "../../actions";
import steps from "./steps";

class OrderForm extends Component {

  render() {
    const {
      step,
      handleSubmit,
      prevStep,
      submitting,
      asyncValidating,
      error,
      clearSubmitErrors
    } = this.props;

    let item = steps[step - 1];
    if (!item) {
      item = steps[0];
    }

    item.props = this.props;

    return (
      <Form className="OrderForm" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="OrderForm-header">
          <span>{step}</span>
          {item.title}
        </div>
        <div className="OrderForm-body">
          <div className="step" id={"step" + step}>
            {<item.component {...item.props}/>}
          </div>
        </div>
        <div className="OrderForm-footer">
          {step > 1 && (
            <Button type="button" size="lg" color="outline-secondary" onClick={() => {
              prevStep();
            }}
                    disabled={submitting || asyncValidating !== false}>
              Prev Step
            </Button>
          )}
          <Button type="submit" size="lg" color="outline-secondary"
                  disabled={submitting || asyncValidating !== false}>
            Next Step
          </Button>
        </div>
        {error && (
          <Modal isOpen={true} toggle={clearSubmitErrors}>
            <ModalBody className="alert alert-danger m-0">{error}</ModalBody>
          </Modal>
        )}
      </Form>
    );
  }

  /**
   * @param data
   */
  handleSubmit = data => {
    const {step, nextStep, onSubmit} = this.props;
    this.validate(data);
    if (step < steps.length) {
      nextStep();
    } else {
      onSubmit(data);
    }
  };

  /**
   * @param data
   */
  validate = data => {

    let errors = {};
    let {step, dispatch, change, resetPreview} = this.props;

    // errors._error = "test";

    if (step === 1) {
      if (!data.name) {
        errors.name = 'Please enter the name of your project.';
      }
    }

    if (step === 2) {
      if (!data.product) {
        errors.product = 'Please choose a product.';
      }

      resetPreview();
      dispatch(change("frontOuter", ""));
      dispatch(change("frontInner", ""));
      dispatch(change("backInner", ""));
      dispatch(change("backOuter", ""));
    }

    if (step === 3) {
      if (!data.frontOuter) {
        errors.frontOuter = 'Please select a layout.';
      }
      if (data.frontInner == null) {
        errors.frontInner = 'Please make your choice from above.';
      }
      if (data.backInner == null) {
        errors.backInner = 'Please make your choice from above.';
      }
      if (data.backOuter == null) {
        errors.backOuter = 'Please make your choice from above.';
      }
    }

    if (step === 4) {
      if (Object.keys(data.items).length <= 1) {
        // errors.items = {
        //   "009": "test"
        // };
        errors._error = 'Please choose a product.';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new SubmissionError(errors);
    }
  };

}

OrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  step: PropTypes.number,
};

OrderForm = reduxForm({
  form: "order",
  // initialValues: {}
})(OrderForm);

OrderForm = connect(
  state => {
    return {
      initialValues: state.app.data,
      step: state.app.step,
    }
  },
  dispatch => {
    return {
      prevStep: () => {
        dispatch(prevStep())
      },
      nextStep: () => {
        dispatch(nextStep())
      },
      resetPreview: () => {
        dispatch(resetPreview())
      },
    }
  }
)(OrderForm);

export default OrderForm