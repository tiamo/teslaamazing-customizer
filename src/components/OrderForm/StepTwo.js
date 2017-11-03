import React, {Component} from 'react';
import {Col, FormGroup, Input, Label, Row} from "reactstrap";
import {PRODUCT_SIZE_UNIT, PRODUCTS_MAP} from "../../constants";

export default class StepTwo extends Component {

  constructor(props) {
    super(props);
    let store = this.props.getStore();
    let value = store.product || '';
    this.state = {
      value: value,
      valid: value !== '' ? true : null,
    };
  }

  validate() {
    if (this.state.value === '') {
      this.setState({
        valid: false,
      });
    }
    return this.state.valid;
  };

  handleChange = e => {
    this.setState({
      valid: e.target.value !== '',
      value: e.target.value
    });
    this.props.updateStore({
      product: e.target.value,
      items: {}
    });
  };

  // render the steps as stepsNavigation
  renderProducts(products) {
    return products.map((product) => (
      <td key={product.name}
          className={"product product--" + product.name.toLowerCase()}>
        <FormGroup className={this.state.value === product.name ? "checked" : null}>
          <Label tabIndex="99">
            <div className="product-box"></div>
            <div className="product-name">{product.name}</div>
            <div className="product-desc">
              {product.size[0] + " x " + product.size[1] + " " + PRODUCT_SIZE_UNIT}
            </div>
            <div className="custom-control custom-radio">
              <Input type="radio"
                     className="custom-control-input"
                     value={product.name}
                     checked={this.state.value === product.name}
                     valid={this.state.valid}
                     onChange={this.handleChange}/>
              <span className="custom-control-indicator"></span>
            </div>
          </Label>
        </FormGroup>
      </td>
    ));
  }

  render() {
    return (
      <div>
        <Row>
          <Col lg="6" xs="12">
            <h2>Magnetic Notes</h2>
            <table className="table">
              <tbody>
              <tr>
                {this.renderProducts([
                  PRODUCTS_MAP.S,
                  PRODUCTS_MAP.M,
                  PRODUCTS_MAP.L
                ])}
              </tr>
              </tbody>
            </table>
          </Col>
          <Col lg="6" xs="12">
            <h2>Magnetic Pad</h2>
            <table className="table">
              <tbody>
              <tr>
                {this.renderProducts([
                  PRODUCTS_MAP.A5,
                  PRODUCTS_MAP.A4,
                  PRODUCTS_MAP.A3
                ])}
              </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
    );
  }

}
