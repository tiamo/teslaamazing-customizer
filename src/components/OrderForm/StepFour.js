import React, {Component} from 'react';
import {Badge, Col, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {MAX_QTY, PRODUCTS_MAP} from "../../constants";
import Previewer from "../Previewer/index";
import classNames from "classnames"
import {Field, formValues} from "redux-form";

const renderField = ({input, color, meta: {touched, error}, ...props}) => {
  let classes = {};
  classes["color-" + color] = true;
  return (
    <InputGroup className={classNames(classes)} {...props}>
      <InputGroupAddon>
        {color === "transparent" && (<span>transparent</span>)}
      </InputGroupAddon>
      <Input valid={error ? false : null} {...input}/>
    </InputGroup>
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

  renderProducts() {

    const {items, product} = this.props;

    return items && Object.keys(items).reverse().map((sku) => {

      let qty = items[sku];
      if (!qty) {
        return "";
      }

      let input = this.refs["input." + sku];
      let color = input && input.props.color;

      return (
        <div key={sku} className="card">
          <div className="card-body">
            <div className="card-img">
              <Previewer product={product} color={color}/>
            </div>
            <div className="card-text">{qty} pcs</div>
          </div>
          <Badge color={color}>{color}</Badge>
          <button className="icon-close" onClick={() => {
            this.deleteProduct(sku)
          }}>
          </button>
        </div>
      );
    });
  }

  render() {
    const product = PRODUCTS_MAP[this.props.product];
    if (!product) {
      return "";
    }
    const catalog = product.catalog || [];
    return (
      <div>
        <Row>
          <Col lg="5" xs="12">
            <div className="inputs">
              {this.renderInputs(catalog)}
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
            <div className="products">
              {this.renderProducts(catalog)}
            </div>
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
  'product',
  'frontOuter',
  'frontInner',
  'backInner',
  'backOuter',
  'items'
)(StepFour);

export default StepFour;