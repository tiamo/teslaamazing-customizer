import React, {Component} from 'react';
import {Col, FormFeedback, FormGroup, Row} from "reactstrap";
import {TECHNICAL_REQUIREMENTS_URL} from "../../constants";
import Dropzone from "react-dropzone";
import Previewer from "../Previewer/index";

export default class StepThree extends Component {

  constructor(props) {
    super(props);
    this.store = this.props.getStore();
    this.state = {
      isDragging: false,
      highlightPreview: null,
      frontOuter: this.store.frontOuter,
      frontInner: this.store.frontInner,
      backInner: this.store.backInner,
      backOuter: this.store.backOuter,
      errors: {
        // frontOuter: "test"
      }
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

  validate() {
    let errors = this.state.errors;
    Object.keys(this.props.sections).forEach((i) => {
      let file = this.state[i];
      if (file === null) {
        if (i === "frontOuter") {
          errors[i] = 'Please select a layout.';
        } else {
          errors[i] = 'Please make your choice from above.';
        }
      }
    });
    this.setState({errors});
    return Object.keys(errors).length === 0;
  }

  /**
   * @param e
   */
  handleDocumentDrag = e => {
    this.setState({
      isDragging: e.type === "dragover"
    });
  };

  handleSelect = (type, file) => {
    let state = {};
    state[type] = file;
    this.props.updateStore(state);
    this.setState({...state});
  };

  handleDelete = (type) => {
    let state = {};
    state[type] = null;
    this.setState(state);
    this.props.updateStore(state);
  };

  animatePreviewer = highlightPreview => {
    clearTimeout(this.t);
    this.t = setTimeout(() => {
      this.setState({highlightPreview})
    }, 100);
  };

  renderSections(items) {
    return Object.keys(items).map((i) => {
      let item = items[i];
      let file = this.state[i];
      let error = this.state.errors[i];
      return (
        <FormGroup key={i} className={"item " + (error ? "is-invalid" : "")}>
          <div className="item-heading">{item.title}</div>
          <div className="item-body">
            {file ? (
              <div className="item-file">
                <span
                  onMouseEnter={() => {
                    return this.animatePreviewer(i);
                  }}
                  onMouseLeave={() => {
                    return this.animatePreviewer(null);
                  }}>
                    {file.name}
                  </span>

                <span className="icon-success icon-circle-down"/>

                <button type="button" className="btn btn-link"
                        onClick={() => {
                          if (window.confirm('Are you sure?')) {
                            this.handleDelete(i)
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
                    this.handleSelect(i, files[0])
                  }}
                  onMouseEnter={() => {
                    return this.animatePreviewer(i);
                  }}
                  onMouseLeave={() => {
                    return this.animatePreviewer(null);
                  }}
                >
                  Select layout
                </Dropzone>
                {item.defaultButton !== undefined && (
                  <button type="button"
                          className={"btn btn-md " + (file === false ? "btn-outline-success" : "btn-outline-secondary")}
                          onClick={() => {
                            this.handleSelect(i, false)
                          }}
                  >
                    {item.defaultButton}
                  </button>
                )}
                {file === false && (
                  <span className="icon-success icon-circle-down"/>
                )}
              </div>
            )}

          </div>

          <FormFeedback>{error}</FormFeedback>
        </FormGroup>
      );

    });
  }

  render() {
    return (
      <div className={this.state.isDragging ? " is-dragging" : ""}>
        <Row>
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
            {this.renderSections(this.props.sections)}
          </Col>
          <Col lg="6" xs="12">
            <Previewer {...{
              product: this.store.product,
              highlight: this.state.highlightPreview,
              frontOuter: this.state.frontOuter,
              frontInner: this.state.frontInner,
              backInner: this.state.backInner,
              backOuter: this.state.backOuter,
            }} />
          </Col>
        </Row>
      </div>
    );
  }

}

StepThree.defaultProps = {
  accept: 'application/pdf',
  sections: {
    frontOuter: {
      title: "01 Front Outer",
    },
    frontInner: {
      title: "02 Front Inner",
      defaultButton: "Leave Empty",
    },
    backInner: {
      title: "03 Back Inner",
      defaultButton: "Leave Empty",
    },
    backOuter: {
      title: "04 Back Outer",
      defaultButton: "Leave Standard",
    },
  }
};

