import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames"
import {Button, Fade, Form} from 'reactstrap';

class OrderForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: this.props.step || 1,
      data: this.props.data || {},
      errors: [],
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown, false);
  }

  render() {
    return (
      <div className="OrderForm">
        <Form onSubmit={this.handleSubmit}>
          <div className="OrderForm-header">
            <span>{this.state.step}</span>
            {this.renderTitle()}
          </div>
          <div className="OrderForm-body">
            {this.renderSteps()}
          </div>
          <div className="OrderForm-footer">
            {this.state.step > 1 && (
              <Button color="outline-secondary" size="lg" onClick={this.prev}>Prev Step</Button>
            )}
            {/*{this.state.step < this.props.children.length ? (*/}
              <Button color="outline-secondary" size="lg" onClick={this.next}>Next Step</Button>
            {/*
            ) : (
              <Button color="primary" size="lg" onClick={this.next}>Place Order</Button>
            )}
            */}
          </div>
        </Form>
      </div>
    );
  }

  renderTitle() {
    return this.currentStep().props.title;
  }

  renderSteps() {
    return React.Children.map(this.props.children, (child, i) => {
      const step = i + 1;
      const active = this.state.step === step;
      const classes = {step: true};
      classes["step-" + step] = true;
      return (
        <Fade in={active}
              id={"step" + step}
              className={classNames(classes)}
              mountOnEnter={true}
              unmountOnExit={true}
              timeout={{enter: 150, exit: 0}}
        >
          {React.cloneElement(child, {
            ref: active ? "active" : null,
            getStore: () => {
              return this.state.data
            },
            updateStore: (data) => {
              this.setState({
                data: {...this.state.data, ...data}
              });
            }
          })}
        </Fade>
      );
    });
  }

  currentStep() {
    return this.props.children[this.state.step - 1];
  }

  validate() {
    let s = this.refs.active;
    if (s !== undefined && s.validate !== undefined) {
      return s.validate();
    }
    return true;
  }

  /**
   * @param {Event} e
   */
  prev = e => {
    let s = this.state.step - 1;
    if (s > 0) {
      this.setState({step: s})
    }
  };

  /**
   * @param {Event} e
   */
  next = e => {
    if (this.validate()) {
      let s = this.state.step + 1;
      if (s < this.props.children.length + 1) {
        this.setState({step: s})
      } else {
        if (this.props.onSubmit !== undefined) {
          this.props.onSubmit(this.state.data);
        }
      }
    }
  };

  /**
   * @param {Event} e
   */
  handleKeydown = e => {
    switch (e.keyCode) {
      case 37: // arrow left
        this.prev(e);
        break;
      case 32: // space
      case 39: // arrow right
        this.next(e);
        break;
      default:
    }
  };

  /**
   * @param {Event} e
   * @returns {boolean}
   */
  handleSubmit = e => {
    e.preventDefault();
    this.next(e);
    return false;
  }
}

OrderForm.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default OrderForm;