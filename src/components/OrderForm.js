import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Fade, Form, Modal, ModalBody} from 'reactstrap';

export default class OrderForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: props.step || 1,
      modal: false,
      result: "",
    };
    this.store = this.props.store || {};
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown, false);
  }

  render() {

    const step = this.currentStep();

    const componentPointer = <step.component
      getStore={() => (this.getStore())}
      updateStore={(e) => {
        this.updateStore(e)
      }}
    />;

    // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method
    let cloneExtensions = {};

    // can only update refs if its a regular React component (not a pure component), so lets check that
    if (componentPointer instanceof Component || // unit test deteceted that instanceof Component can be in either of these locations so test both (not sure why this is the case)
      (componentPointer.type && componentPointer.type.prototype instanceof Component)) {
      cloneExtensions.ref = 'activeComponent';
    }

    let compToRender = React.cloneElement(componentPointer, cloneExtensions);

    return (
      <Fade>
        <Form className="OrderForm">
          <div className="OrderForm-header">
            <span>{this.state.step}</span>
            {step.title}
          </div>
          <div className="OrderForm-body">
            {compToRender}
          </div>
          <div className="OrderForm-footer">
            {this.state.step > 1 && (
              <Button color="outline-secondary" size="lg" onClick={this.prev}>Prev Step</Button>
            )}
            {this.state.step < this.props.steps.length && (
              <Button color="outline-secondary" size="lg" onClick={this.next}>Next Step</Button>
            )}
            {this.state.step >= this.props.steps.length && (
              <Button color="primary" size="lg" onClick={this.process}>Place Order</Button>
            )}
          </div>
        </Form>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalBody className="alert alert-success m-0">
            {this.state.result}
          </ModalBody>
        </Modal>
      </Fade>
    );
  }

  currentStep() {
    return this.props.steps[this.state.step - 1];
  }

  getStore() {
    return this.store;
  }

  updateStore(update) {
    this.store = {
      ...this.store,
      ...update,
    }
  }

  resetStore() {
    this.store = this.props.store || {};
  }

  toggleModal = e => {
    this.setState({
      modal: !this.state.modal
    });
  };

  process = e => {
    if (this.validate()) {
      this.setState({
        result: <pre>{JSON.stringify(this.store, null, 4)}</pre>
      });
      this.toggleModal();
    }
  };

  prev = e => {
    let n = this.state.step - 1;
    if (n > 0) {
      this.setState({step: n})
    }
  };

  validate() {
    let s = this.refs.activeComponent;
    if (s !== undefined && s.validate !== undefined) {
      return s.validate();
    }
    return true;
  }

  next = e => {
    if (this.validate()) {
      let n = this.state.step + 1;
      if (n < this.props.steps.length + 1) {
        this.setState({step: n})
      }
    }
  };

  handleKeydown = e => {
    switch (e.keyCode) {
      case 37: // arrow left
        this.prev(e);
        break;
      case 32: // space
      case 39: // arrow right
        this.next(e);
        break;
    }
  }
}

OrderForm.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    component: PropTypes.isRequired
  })).isRequired,
  store: PropTypes.object
};
