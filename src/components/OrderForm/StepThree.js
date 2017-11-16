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

import {debounce} from "lodash";

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

    this.animatePreviewerDebounced = debounce((name) => {
      this.animatePreviewer(name);
    }, 250);
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

    // console.log(props);

    if (value && !this.props[name]) {
      const {startAsyncValidation, stopAsyncValidation} = props;
      startAsyncValidation(name);
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

            throw new Error('Incorrect pdf size. Your size is ' + pdfSize.join('x') + ' ' + PRODUCT_SIZE_UNIT +
              ', expected size is ' + validSize.join('x') + ' ' + PRODUCT_SIZE_UNIT + '.');

          } else {
            let canvas = this.refs["canvas." + name];
            if (canvas) {


              let ctx = canvas.getContext('2d');

              // x3 for better image quality
              canvas.width = viewport.width * 3;
              canvas.height = viewport.height * 3;

              // validate text elements
              page.getTextContent().then((res) => {

                if (res.items.length) {
                  throw new Error('Invalid pdf file. Your file contains text elements, it needs to upload a vector file.');
                } else {

                  // render page
                  page.render({
                    canvasContext: ctx,
                    viewport: page.getViewport(canvas.width / page.getViewport(1).width),
                  }).then(() => {
                    this.props.setPreview(name, canvas.toDataURL('image/jpeg'));
                    // free up memory
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                  });
                }
              }).catch((error) => {
                props.dispatch(props.change(name, ""));
                stopAsyncValidation({[name]: error.message});
              });

            }
          }

          stopAsyncValidation();

        }).catch((error) => {
          props.dispatch(props.change(name, ""));
          stopAsyncValidation({[name]: error.message});
        });

      }).catch((error) => {
        stopAsyncValidation({[name]: error.message});
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
        <div className="item-body"
             onMouseEnter={() => {
               this.animatePreviewerDebounced(name);
             }}
             onMouseLeave={() => {
               this.animatePreviewerDebounced(null);
             }}
        >
          {value && !error && !asyncValidating ? (
            <div className="item-file">
              <span>
                  {value.name}
              </span>
              <span className="icon-success icon-valid"/>
              <button type="button" className="btn btn-sm btn-link"
                      onClick={() => {
                        // if (window.confirm('Are you sure?')) {
                        onChange(null);
                        this.props.setPreview(name, null)
                        // }
                      }}>
                Delete
              </button>
            </div>
          ) : (
            <div className="item-select-file">
              <Row>
                <Col sm="5" xs="12">
                  <Dropzone
                    className="btn btn-md btn-block btn-outline-secondary action-upload"
                    acceptClassName="btn-outline-success"
                    rejectClassName="btn-outline-danger"
                    multiple={false}
                    accept={this.props.accept}
                    onDrop={(files) => {
                      onChange(files[0]);
                      this.setState({isDragging: false})
                    }}
                  >
                    Select layout
                  </Dropzone>
                </Col>
                <Col sm="5" xs="12">
                  {defaultButton && (
                    <button type="button"
                            className={"btn btn-block btn-md " + (value === false ? "btn-outline-success" : "btn-outline-secondary")}
                            onClick={() => {
                              onChange(false);
                              this.props.setPreview(name, null)
                            }}
                    >
                      {defaultButton}
                    </button>
                  )}
                </Col>
                <Col sm="2">
                  {value === false && (
                    <span className="icon-success icon-valid"/>
                  )}
                </Col>
              </Row>
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
        <Col lg="5" xs="12">
          <p>
            Your mockups must be strictly in PDF format.
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
        <Col lg="7" xs="12">

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