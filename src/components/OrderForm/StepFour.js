import React, {Component} from 'react';
import {Badge, Col, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {MAX_QTY, PRODUCTS_MAP} from "../../constants";
import Previewer from "../Previewer/index";
import classNames from "classnames"
import {Field, formValues} from "redux-form";

import {CSSTransition, TransitionGroup} from 'react-transition-group'

import ScrollArea from 'react-scrollbar';

const renderField = ({input, color, meta: {error}, ...props}) => {
  let classes = {};
  classes["color-" + color] = true;

  return (
    <label>
      <InputGroup className={classNames(classes)} {...props}>
        <InputGroupAddon>
          {color === "transparent" && (<span>transparent</span>)}
        </InputGroupAddon>
        <Input valid={error ? false : null} {...input}/>
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
  }

  renderInputs(catalog) {
    return catalog.map((item, key) => (
      <div key={key} className="card">
        <div className="card-header">
          {item.title}
        </div>
        <div className="card-body">
          <Row>
            {item.items.map(({color, sku}, key) => (
              <Col key={key} xs="6">
                <Field name={"items." + sku}
                       ref={"input." + sku}
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

  renderProduct(sku, qty) {
    const {product} = this.props;
    const input = this.refs["input." + sku];
    const color = input && input.props.color;
    // console.log(input);
    // TODO: input.onChange ...
    return (
      <div className="card">
        <div className="card-body">
          <div className="card-img">
            <Previewer product={product} color={color}/>
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

  render() {
    const {items, product} = this.props;
    const PRODUCT = PRODUCTS_MAP[product];
    if (!PRODUCT) {
      return "";
    }
    return (
      <div>
        <Row>
          <Col lg="5" xs="12">
            <div className="inputs">
              {this.renderInputs(PRODUCT.catalog)}
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
              // speed={0.8}
              className="products"
              contentClassName="content"
              horizontal={true}
              // smoothScrolling= {true}
              // minScrollSize={40}
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

  deleteProduct = key => {
    const {dispatch, change} = this.props;
    dispatch(change("items." + key, ""));
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