import React, {Component} from 'react';
import {
  Badge,
  Button,
  Col,
  Fade,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row
} from 'reactstrap';
import Dropzone from 'react-dropzone';
import {LAYOUTS, MAX_QTY, PRODUCTS_MAP} from "../constants";
import classNames from "classnames"
import Previewer from "./Previewer";

export class One extends Component {

  constructor(props) {
    super(props);

    let value = this.props.getStore().name;
    this.state = {
      valid: value !== '' ? true : null,
      error: null,
      value: value
    };
  }

  validate() {
    if (this.state.value === '') {
      this.setState({valid: false, error: 'Please enter the name of your project.'});
    }
    this.props.updateStore({
      name: this.state.value
    });
    return this.state.valid;
  };

  handleChange = e => {
    let state = {
      value: e.target.value,
      valid: e.target.value !== '',
      error: ''
    };
    this.setState(state);
  };

  render() {
    return (
      <div className="StepOne">
        <FormGroup>
          <Input size="lg"
                 valid={this.state.valid}
                 placeholder="Insert name of your project"
                 defaultValue={this.state.value}
                 onChange={this.handleChange}/>
          <FormFeedback>{this.state.error}</FormFeedback>
        </FormGroup>
      </div>
    );
  }
}

export class Two extends Component {

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
          className={"StepTwo-product StepTwo-product-" + product.name.toLowerCase()}>
        <FormGroup className={this.state.value === product.name ? "checked" : null}>
          <Label>
            <div className="product-box"></div>
            <div className="product-name">{product.name}</div>
            <div className="product-desc">{product.size}</div>
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
      <div className="StepTwo">
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

export class Three extends Component {

  constructor(props) {
    super(props);
    let store = this.props.getStore();
    this.state = {
      frontInner: store.frontInner,
      frontOuter: store.frontOuter,
      backInner: store.backInner,
      backOuter: store.backOuter,
      isDragging: false,
      highlightPreview: null,
    };
    this.t = 0;
  }

  componentDidMount() {
    document.addEventListener('dragover', this.handleDocumentDrag, false);
    document.addEventListener('dragleave', this.handleDocumentDrag, false);
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', this.handleDocumentDrag);
    document.removeEventListener('dragleave', this.handleDocumentDrag);
  }

  handleDocumentDrag = e => {
    this.setState({
      isDragging: e.type === "dragover"
    });
  };

  handleSelect = (type, file) => {
    let state = {};
    state[type] = file;
    this.setState(state);
    this.props.updateStore(state);
  };

  handleDelete = (type) => {
    let state = {};
    state[type] = null;
    this.setState(state);
    this.props.updateStore(state);
  };

  animatePreviewer = highlightPreview => {
    clearTimeout(this.t);
    this.t = setTimeout(()=>{
      this.setState({highlightPreview})
    }, 400);
  };

  renderSections(items) {
    return Object.keys(items).map((i) => (
      <div key={i} className="item" onMouseEnter={() => {
        return this.animatePreviewer(i);
      }} onMouseLeave={() => {
        return this.animatePreviewer(null);
      }}>
        <div className="item-heading">{items[i].title}</div>
        <div className="item-body">
          {this.state[i] ? (
            <div className="item-file">
              {this.state[i].name}
              <button className="btn btn-link"
                      onClick={() => {
                        this.handleDelete(i)
                      }}>Change
              </button>
            </div>
          ) : (
            <div className="item-select-file">
              <Dropzone
                className="btn btn-lg btn-outline-secondary action-upload"
                acceptClassName="btn-outline-success"
                rejectClassName="btn-outline-danger"
                multiple={false}
                accept={this.props.accept}
                onDrop={(files) => {
                  this.handleSelect(i, files[0])
                }}
                onDragOver={(e) => {
                  console.log(e);
                }}
              >
                Select layout
              </Dropzone>
              <button type="button"
                      className="btn btn-lg btn-outline-secondary active action-delete">
                Leave empty
              </button>
            </div>
          )}

        </div>
      </div>
    ));
  }

  render() {
    return (
      <Fade className={"StepThree" + (this.state.isDragging ? " is-dragging" : "")}>
        <Row>
          <Col lg="6" xs="12">
            <p>
              You mockups must be strictly in PDF format.
              Please, make sure that your files comply with all the
              {" "}
              <a target="_blank" rel="noopener noreferrer" href="https://teslaamazing.com">
                technical requirements
              </a>
            </p>
            <hr/>
            {this.renderSections(this.props.sections)}
          </Col>
          <Col lg="6" xs="12">
            {/*<div className="jumbotron">*/}

              <Previewer highlight={this.state.highlightPreview}/>

            {/*</div>*/}
          </Col>
        </Row>
      </Fade>
    );
  }
}

Three.defaultProps = {
  accept: 'application/pdf',
  sections: LAYOUTS
};

export class Four extends Component {

  constructor(props) {
    super(props);
    this.store = this.props.getStore();
    this.state = {
      items: this.store.items,
      valid: null,
      color: "blue"
    }
  }

  validate() {
    let valid = Object.keys(this.state.items).length > 0;
    this.setState({valid: valid ? null : false});
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
              <Previewer color={color}/>
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
    let catalog = PRODUCTS_MAP[this.store.product].catalog || [];
    return (
      <Fade className="StepFour">
        <Row>
          <Col lg="5" xs="12">
            <div className="inputs">
              {this.renderInputs(catalog)}
            </div>
          </Col>
          <Col lg="7" xs="12">
            <Previewer color={this.state.color}/>
            <div className="products">
              {this.renderProducts(catalog)}
            </div>
          </Col>
        </Row>
      </Fade>
    );
  }

  deleteProduct = sku => {
    const items = Object.assign({}, this.state.items);
    delete items[sku];
    this.setState({items});
  };

  handleChange = e => {
    // only numbers
    let value = parseInt(e.target.value.replace(/\D/g, ''));
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
