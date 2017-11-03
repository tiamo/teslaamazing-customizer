import React, {Component} from "react";
import PropTypes from 'prop-types';
import classNames from "classnames"
import {PDF_BORDER_SIZE, PRODUCT_SIZE_FACTOR, PRODUCTS_MAP} from "../../constants";

const pdfjs = require('pdfjs-dist');
require('pdfjs-dist/web/compatibility');
pdfjs.PDFJS.workerSrc = 'pdf.worker.js';

class Previewer extends Component {

  constructor(props) {
    super(props);

    // Calculate Previewer size
    let scaleFactor;
    switch (props.product.toUpperCase()) {
      case 'L':
        scaleFactor = 0.8;
        break;
      case 'A5':
        scaleFactor = 0.4;
        break;
      case 'A4':
        scaleFactor = 0.4;
        break;
      case 'A3':
        scaleFactor = 0.33;
        break;
      default:
        scaleFactor = 1;
    }
    this.product = PRODUCTS_MAP[props.product];
    if (this.product) {
      this.size = [
        ((this.product.size[0] + PDF_BORDER_SIZE) / PRODUCT_SIZE_FACTOR) * scaleFactor,
        ((this.product.size[1] + PDF_BORDER_SIZE) / PRODUCT_SIZE_FACTOR) * scaleFactor
      ];
    } else {
      this.size = [0,0];
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setCover('frontOuter', nextProps.frontOuter);
    this.setCover('frontInner', nextProps.frontInner);
    this.setCover('backInner', nextProps.backInner);
    this.setCover('backOuter', nextProps.backOuter);
  }

  render() {

    let {
      highlight,
      product,
      color,
      frontOuter,
      frontInner,
      backInner,
      backOuter,
      ...other
    } = this.props;

    let classes = {book: true};

    classes["color-" + color] = true;
    if (highlight) {
      classes["highlight-" + highlight] = true;
    }

    let style = {};
    style.width = this.size[0];
    style.height = this.size[1];

    return (
      <div className="Previewer" {...other}>

        <figure className={classNames(classes)} style={style}>

          <ul className="cover front">
            {this.renderCoverSide("frontOuter")}
            {this.renderCoverSide("frontInner")}
          </ul>

          <ul className="page">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>

          <ul className="cover back">
            {this.renderCoverSide("backInner")}
            {this.renderCoverSide("backOuter")}
          </ul>

        </figure>

      </div>
    )
  }

  setCover(type, file) {

    let canvas = this.refs[type + "Canvas"];
    if (canvas === undefined) {
      return;
    }

    // clear canvas before rendering
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (file) {

      pdfjs.getDocument({url: URL.createObjectURL(file)}).then((pdf) => {
        pdf.getPage(1).then((page) => {
          let viewport = page.getViewport(1);

          let necessarySize = [
            this.product.size[0] + PDF_BORDER_SIZE,
            this.product.size[1] + PDF_BORDER_SIZE,
          ], pdfSize = [
            Math.floor(viewport.width * PRODUCT_SIZE_FACTOR),
            Math.floor(viewport.height * PRODUCT_SIZE_FACTOR)
          ];

          if (pdfSize[0] !== necessarySize[0] ||
            pdfSize[1] !== necessarySize[1]
          ) {


            console.log(this);

            // let state = {};
            // state.errors = {};
            // state.errors[type] = 'Incorrect pdf size. Your size is ' +
            //   pdfSize.join('x') + ' ' + PRODUCT_SIZE_UNIT +
            //   ', expected size is ' +
            //   necessarySize.join('x') + ' ' + PRODUCT_SIZE_UNIT + '.';
            //
            // state[type] = null;
            // this.setState({...state});
            // this.props.updateStore(state);

          } else {
            let scaleRatio = canvas.width / page.getViewport(1).width;
            let scaleViewport = page.getViewport(scaleRatio);
            page.render({canvasContext: ctx, viewport: scaleViewport}).then(function() {
            });
          }
        });
      }).catch(function(error) {
        console.log(error);
        if (this.props.onRejected) {
          this.props.onRejected(error);
        }
      });
    }

  }

  renderCoverSide(name) {
    return (
      <li>
        <div className={"highlight" + (name === this.props.highlight ? " active" : "")}/>
        <canvas ref={name + "Canvas"} width={this.size[0]} height={this.size[1]}/>
      </li>
    );
  }
}

Previewer.defaultProps = {
  color: "white",
  product: "M",
  frontOuter: null,
  frontInner: null,
  backInner: null,
  backOuter: null,
};

Previewer.propTypes = {
  product: PropTypes.string.isRequired,
  onRejected: PropTypes.func,
};

export default Previewer;

