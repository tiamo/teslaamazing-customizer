import React, {Component} from 'react';
import {Badge, Button, Col, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {MAX_QTY, PRODUCTS_MAP} from "../../constants";
import Previewer from "../Previewer/index";
import classNames from "classnames"

export default class StepFour extends Component {

  constructor(props) {
    super(props);
    this.store = this.props.getStore();
    this.state = {
      items: this.store.items,
      valid: null,
      color: "white"
    }
  }

  validate() {
    let valid = Object.keys(this.state.items).length > 0;
    // this.setState({valid: valid ? null : false});
    return valid;
  }

  renderInputs(catalog) {
    return catalog.map((item, key) => (
      <div key={key} className="card">
        <div className="card-header">
          {item.title}
        </div>
        <div className="card-body">
          <Row>
            {item.items.map((product, key) => (
              <Col key={key} xs="6">
                <ProductInput ref={"input_" + product.sku}
                              color={product.color}
                              onMouseEnter={(e) => this.changePreviewerColor(product.color)}
                              inputProps={{
                                // defaultValue: this.store.items[product.sku] || "",
                                value: this.state.items[product.sku] || "",
                                onChange: this.handleChange,
                                name: product.sku,
                                valid: this.state.valid
                              }}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    ));
  }

  renderProducts() {
    return Object.keys(this.state.items).reverse().map((sku) => {
      let qty = this.state.items[sku];
      let input = this.refs["input_" + sku];
      let color = input && input.props.color;

      return (
        <div key={sku} className="card">
          <div className="card-body">
            <div className="card-img">
              <Previewer product={this.store.product} color={color}/>
            </div>
            <div className="card-text">{qty} pcs</div>
          </div>
          <Badge color={color}>{color}</Badge>
          <Button type="button" color="danger" className="close" onClick={() => {
            return this.deleteProduct(sku);
          }}>
            <span>&times;</span>
          </Button>
        </div>
      );
    });
  }

  render() {
    const product = PRODUCTS_MAP[this.store.product];
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
              product: this.store.product,
              color: this.state.color,
              frontOuter: this.store.frontOuter,
              frontInner: this.store.frontInner,
              backInner: this.store.backInner,
              backOuter: this.store.backOuter,
            }}/>
            <div className="products">
              {this.renderProducts(catalog)}
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  deleteProduct = sku => {
    const items = Object.assign({}, this.state.items);
    delete items[sku];
    this.setState({items});
  };

  handleChange = e => {
    // only numbers
    let value = parseInt(e.target.value.replace(/\D/g, ''), 10);
    const items = Object.assign({}, this.state.items);

    if (value > MAX_QTY) {
      value = MAX_QTY;
    }

    items[e.target.name] = value;
    if (!value) {
      delete items[e.target.name];
    }
    this.setState({items}, () => {
      this.props.updateStore({
        items: this.state.items
      });
      this.validate();
    });
  };

  changePreviewerColor = (color) => {
    this.setState({color: color});
  };

}

export class ProductInput extends Component {
  render() {
    let {inputProps, color, ...other} = this.props;
    let classes = {};
    classes["color-" + color] = true;
    return (
      <InputGroup className={classNames(classes)} {...other}>
        <InputGroupAddon>
          {color === "transparent" && (<span>transparent</span>)}
        </InputGroupAddon>
        <Input {...inputProps}/>
      </InputGroup>
    );
  }
}

ProductInput.defaultProps = {
  color: null
};
