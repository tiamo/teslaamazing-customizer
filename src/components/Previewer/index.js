import React, {Component} from "react";
import PropTypes from 'prop-types';
import classNames from "classnames"
import {PDF_BORDER_SIZE, PRODUCT_SIZE_FACTOR, PRODUCTS_MAP} from "../../constants";
import {connect} from "react-redux";

class Previewer extends Component {

  static scaleFactor(product) {
    switch (product) {
      case 'L':
        return 0.8;
      case 'A5':
        return 0.4;
      case 'A4':
        return 0.4;
      case 'A3':
        return 0.33;
      default:
        return 1;
    }
  }

  renderCoverSide(name) {
    return (
      <li style={{"backgroundImage": `url(${this.props[name]})`}}>
        {!this.props[name] && (
          <div className={"highlight" + (name === this.props.highlight ? " active" : "")}/>
        )}
      </li>
    );
  }

  render() {

    let {
      highlight,
      color,
      product
    } = this.props;

    product = PRODUCTS_MAP[product];
    if (!product) {
      return "Unknown product";
    }

    // Calculate Previewer size
    let scaleFactor = Previewer.scaleFactor(product.name);
    this.size = [
      ((product.size[0] + PDF_BORDER_SIZE) / PRODUCT_SIZE_FACTOR) * scaleFactor,
      ((product.size[1] + PDF_BORDER_SIZE) / PRODUCT_SIZE_FACTOR) * scaleFactor
    ];

    let classes = {book: true};
    classes["color-" + color] = true;
    if (highlight) {
      classes["highlight-" + highlight] = true;
    }

    let style = {};
    style.width = this.size[0];
    style.height = this.size[1];

    return (
      <div className="Previewer">

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

}

Previewer.defaultProps = {
  color: "white",
  product: "M"
};

Previewer.propTypes = {
  product: PropTypes.string.isRequired,
  frontOuter: PropTypes.string,
  frontInner: PropTypes.string,
  backInner: PropTypes.string,
  backOuter: PropTypes.string,
};

Previewer = connect(
  state => {
    console.log(state.app.preview);
    return state.app.preview
  }
)(Previewer);

export default Previewer;

