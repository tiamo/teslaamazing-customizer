import React, {Component} from 'react';
import {connect} from "react-redux";
import Dropzone from "react-dropzone";
import {Field, formValues} from "redux-form";
import {Col, FormFeedback, FormGroup, Row} from "reactstrap";
import Previewer from "../Previewer";
import classNames from "classnames"
import pdfjs from "pdfjs-dist"
import {setPreview} from "../../actions";
import {
  PDF_BORDER_SIZE,
  PRODUCT_SIZE_FACTOR,
  PRODUCT_SIZE_UNIT,
  PRODUCTS_MAP,
  TECHNICAL_REQUIREMENTS_URL
} from "../../constants";

// const pdfjs = require('pdfjs-dist');
// require('pdfjs-dist/web/compatibility');
// pdfjs.PDFJS.workerSrc = 'pdf.worker.js';

const sections = [
  {
    name: "frontOuter",
    label: "01 Front Outer",
  },
  {
    name: "frontInner",
    label: "02 Front Inner",
    defaultButton: "Leave Empty",
  },
  {
    name: "backInner",
    label: "03 Back Inner",
    defaultButton: "Leave Empty",
  },
  {
    name: "backOuter",
    label: "04 Back Outer",
    defaultButton: "Leave Standard",
  },
];

class StepThree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      highlightPreview: null,
    };
    this.hlTimer = 0;
  }

  componentDidMount() {
    document.addEventListener('dragover', this.handleDocumentDrag, false);
    document.addEventListener('dragleave', this.handleDocumentDrag, false);
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', this.handleDocumentDrag);
    document.removeEventListener('dragleave', this.handleDocumentDrag);
  }

  /**
   * @param {Event} e
   */
  handleDocumentDrag = e => {
    this.setState({
      isDragging: e.type === "dragover"
    });
  };

  animatePreviewer = highlightPreview => {
    clearTimeout(this.hlTimer);
    this.hlTimer = setTimeout(() => {
      this.setState({highlightPreview})
    }, 100);
  };

  validateField = (value, allValues, props, name) => {

    // console.log("VALIDATE", name, value);

    if (value) {

      const {startAsyncValidation, stopAsyncValidation} = props;

      // props.dispatch(props.autofill(name, null));
      // console.log(props);

      startAsyncValidation();

      const product = PRODUCTS_MAP[allValues.product];

      pdfjs.getDocument({url: URL.createObjectURL(value)}).then((pdf) => {

        pdf.getPage(1).then((page) => {

          let viewport = page.getViewport(1);
          let validSize = [
            product.size[0] + PDF_BORDER_SIZE,
            product.size[1] + PDF_BORDER_SIZE,
          ], pdfSize = [
            Math.floor(viewport.width * PRODUCT_SIZE_FACTOR),
            Math.floor(viewport.height * PRODUCT_SIZE_FACTOR)
          ];

          if (pdfSize[0] !== validSize[0] || pdfSize[1] !== validSize[1]) {
            props.dispatch(props.change(name, ""));
            throw 'Incorrect pdf size. Your size is ' + pdfSize.join('x') + ' ' + PRODUCT_SIZE_UNIT +
            ', expected size is ' + validSize.join('x') + ' ' + PRODUCT_SIZE_UNIT + '.';

          } else {
            let canvas = this.refs["canvas." + name];
            if (canvas) {
              canvas.width = viewport.width * 3;
              canvas.height = viewport.height * 3;
              page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: page.getViewport(canvas.width / page.getViewport(1).width)
              }).then(() => {
                this.props.setPreview(name, canvas.toDataURL('image/jpeg'));
              });
              // props.dispatch(props.autofill(name, value));
            }
          }

          stopAsyncValidation();

        }).catch((error) => {
          stopAsyncValidation({[name]: error});
        });

      }).catch((error) => {
        stopAsyncValidation({[name]: error});
      });
    }

  };

  renderField = ({input: {name, value, onChange}, meta: {error, asyncValidating}, label, defaultButton}) => {

    let classes = {item: true};
    if (error) {
      classes["is-invalid"] = true;
    }
    if (asyncValidating) {
      classes["async-validating"] = true;
    }

    return (
      <FormGroup className={classNames(classes)}>
        <div className="item-heading">{label}</div>
        <div className="item-body">
          {value ? (
            <div className="item-file">
              <span
                onMouseEnter={() => {
                  return this.animatePreviewer(name);
                }}
                onMouseLeave={() => {
                  return this.animatePreviewer(null);
                }}>
                  {value.name}
              </span>
              <span className="icon-success icon-valid"/>
              <button type="button" className="btn btn-link"
                      onClick={() => {
                        if (window.confirm('Are you sure?')) {
                          onChange(null);
                          this.props.setPreview(name, null)
                        }
                      }}>
                Delete
              </button>
            </div>
          ) : (
            <div className="item-select-file">
              <Dropzone
                className="btn btn-md btn-outline-secondary action-upload"
                acceptClassName="btn-outline-success"
                rejectClassName="btn-outline-danger"
                multiple={false}
                accept={this.props.accept}
                onDrop={(files) => {
                  onChange(files[0]);
                  this.setState({isDragging: false})
                }}
                onMouseEnter={() => {
                  this.animatePreviewer(name);
                }}
                onMouseLeave={() => {
                  this.animatePreviewer(null);
                }}
              >
                Select layout
              </Dropzone>
              {defaultButton && (
                <button type="button"
                        className={"btn btn-md " + (value === false ? "btn-outline-success" : "btn-outline-secondary")}
                        onClick={() => {
                          onChange(false);
                          this.props.setPreview(name, null)
                        }}
                >
                  {defaultButton}
                </button>
              )}
              {value === false && (
                <span className="icon-success icon-valid"/>
              )}
            </div>
          )}
        </div>
        <FormFeedback>{error}</FormFeedback>
      </FormGroup>
    );
  };

  render() {

    return (
      <Row className={this.state.isDragging ? " is-dragging" : ""}>
        <Col lg="6" xs="12">
          <p>
            You mockups must be strictly in PDF format.
            Please, make sure that your files comply with all the
            {" "}
            <a target="_blank" rel="noopener noreferrer" href={TECHNICAL_REQUIREMENTS_URL}>
              technical requirements
            </a>
          </p>
          <hr/>
          {sections.map((section, key) => (
            <Field key={key}
                   validate={this.validateField}
                   component={this.renderField}
                   {...section}
            />
          ))}
        </Col>
        <Col lg="6" xs="12">

          <Previewer {...{
            product: this.props.product,
            highlight: this.state.highlightPreview,
          }} />

          {/* TODO: Optimize */}
          <canvas ref="canvas.frontOuter" style={{display: "none"}}/>
          <canvas ref="canvas.frontInner" style={{display: "none"}}/>
          <canvas ref="canvas.backInner" style={{display: "none"}}/>
          <canvas ref="canvas.backOuter" style={{display: "none"}}/>

        </Col>
      </Row>
    );
  }

}

StepThree.defaultProps = {
  accept: 'application/pdf',
  product: ""
};

StepThree = formValues('product')(StepThree);

StepThree = connect(
  state => {
    return state.app.preview
  },
  dispatch => {
    return {
      setPreview: (name, value) => {
        dispatch(setPreview(name, value))
      },
    }
  }
)(StepThree);

export default StepThree;