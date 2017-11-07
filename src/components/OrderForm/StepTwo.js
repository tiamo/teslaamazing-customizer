import React from 'react';
import {Field} from "redux-form";
import {Col, FormGroup, Label, Row, Input} from "reactstrap";
import {PRODUCT_SIZE_UNIT, PRODUCTS_MAP} from "../../constants";

const renderField = ({input, label, size, meta: {error}}) => (
  <FormGroup className={input.value === label ? "checked" : null}>
    <Label tabIndex="99">
      <div className="product-box"/>
      <div className="product-name">{label}</div>
      <div className="product-desc">
        {size[0] + " x " + size[1] + " " + PRODUCT_SIZE_UNIT}
      </div>
      <div className="custom-control custom-radio">
        <Input type="radio"
               className="custom-control-input"
               {...input}
               value={label}
               valid={error ? false : null}
        />
        <span className="custom-control-indicator"/>
      </div>
    </Label>
  </FormGroup>
);

export default () => (
  <div>
    <Row>
      <Col lg="6" xs="12">
        <h2>Magnetic Notes</h2>
        <table className="table">
          <tbody>
          <tr>
            {[PRODUCTS_MAP.S, PRODUCTS_MAP.M, PRODUCTS_MAP.L].map((product, key) => (
              <td key={key} className={"product product--" + product.name.toLowerCase()}>
                <Field name="product"
                       label={product.name}
                       size={product.size}
                       component={renderField}
                />
              </td>
            ))}
          </tr>
          </tbody>
        </table>
      </Col>
      <Col lg="6" xs="12">
        <h2>Magnetic Pad</h2>
        <table className="table">
          <tbody>
          <tr>
            {[PRODUCTS_MAP.A5, PRODUCTS_MAP.A4, PRODUCTS_MAP.A3].map((product, key) => (
              <td key={key} className={"product product--" + product.name.toLowerCase()}>
                <Field name="product"
                       label={product.name}
                       size={product.size}
                       component={renderField}
                />
              </td>
            ))}
          </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  </div>
);