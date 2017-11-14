import React, {Component} from 'react';
import {Badge, Col, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {MAX_QTY, PRODUCTS_MAP} from "../../constants";
import Previewer from "../Previewer/index";
import classNames from "classnames"
import {Field, formValues} from "redux-form";
import {debounce} from "lodash";

import {CSSTransition, TransitionGroup} from 'react-transition-group'

import ScrollArea from 'react-scrollbar';

const PRODUCT_PREVIEW_SCALE = 0.26;

class InputDebounced extends Component {

  constructor(props) {
    super();
    this.state = {value: props.value};
  }

  componentWillReceiveProps(props) {
    this.setState({value: props.value});
  }

  componentWillMount() {
    this.forwardChange = debounce(this.props.onChange, 1500);
  }

  onChange = e => {
    e.persist();
    this.setState({value: e.target.value});
    this.forwardChange(e);
  };

  render() {
    return <Input {...this.props} onChange={this.onChange} value={this.state.value} />
  }
}

const renderField = ({input, color, meta: {error}, ...props}) => {
  let classes = {};
  classes["color-" + color] = true;

  return (
    <label>
      <InputGroup className={classNames(classes)} {...props}>
        <InputGroupAddon>
          {color === "transparent" && (<span>transparent</span>)}
        </InputGroupAddon>
        <InputDebounced valid={error ? false : null}  {...input}/>
      </InputGroup>
    </label>
  );
};

class StepFour extends Component {

  constructor(props) {
    super(props);
    this.state = {
      color: "white"
    };

    this.product = PRODUCTS_MAP[this.props.product];
    // TODO: optimize
    this.inputs = {};
  }

  renderProduct(sku, qty) {
    const {product} = this.props;
    const input = this.inputs[sku];
    const color = input && input.props.color;
    // console.log(input);
    // TODO: input.onChange ...
    return (
      <div className="card">
        <div className="card-body">
          <div className="card-img">
            <Previewer product={product} color={color} scale={PRODUCT_PREVIEW_SCALE}/>
          </div>
          <div className="card-text">{qty} pcs</div>
        </div>
        <Badge color={color} pill={true}>{color}</Badge>
        <button className="icon-close" onClick={(e) => {
          e.preventDefault();
          this.deleteProduct(sku);
        }}>
        </button>
      </div>
    );
  }

  renderInputs() {
    if (!this.product) {
      return "";
    }
    return this.product.catalog.map((item, key) => (
      <div key={key} className="card">
        <div className="card-header">
          {item.title}
        </div>
        <div className="card-body">
          <Row>
            {item.items.map(({color, sku}, key) => (
              <Col key={key} xs="6">
                <Field name={"items." + sku}
                       ref={(ref) => {
                         this.inputs[sku] = ref
                       }}
                       color={color}
                       component={renderField}
                       normalize={this.normalizeField}
                       onMouseEnter={(e) => this.changePreviewerColor(color)}
                />

              </Col>
            ))}
          </Row>
        </div>
      </div>
    ));
  }

  render() {

    if (!this.product) {
      return "";
    }

    const {items} = this.props;

    return (
      <div>
        <Row>
          <Col lg="5" xs="12">
            <div className="inputs">
              {this.renderInputs()}
            </div>
          </Col>
          <Col lg="7" xs="12">
            <Previewer {...{
              product: this.props.product,
              color: this.state.color,
              frontOuter: this.props.frontOuter,
              frontInner: this.props.frontInner,
              backInner: this.props.backInner,
              backOuter: this.props.backOuter,
            }}/>
            <ScrollArea
              ref="scrollArea"
              className="products"
              contentClassName="content"
              horizontal={true}
            >
              <TransitionGroup>
                {Object.keys(items).reverse().map((key) => {
                  const qty = items[key];
                  return qty && (
                    <CSSTransition
                      classNames="animate"
                      timeout={500}
                      key={key}
                    >
                      {this.renderProduct(key, qty)}
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </ScrollArea>
          </Col>
        </Row>
      </div>
    );
  }

  updateProduct = (key, value) => {
    const {dispatch, change} = this.props;
    dispatch(change("items." + key, value));
  };

  deleteProduct = key => {
    this.updateProduct(key, "")
  };

  normalizeField = value => {
    value = value.replace(/\D/g, '');
    if (value > MAX_QTY) {
      value = MAX_QTY;
    }
    return value;
  };

  changePreviewerColor = (color) => {
    this.setState({color: color});
  };
}

StepFour = formValues(
  'frontOuter',
  'frontInner',
  'backInner',
  'backOuter',
  'product',
  'items'
)(StepFour);

export default StepFour;