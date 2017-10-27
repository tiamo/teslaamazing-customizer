import React, {Component} from "react";
import * as Products from "./Svg/Products";

export default class Previewer extends Component {

  constructor(props) {
    super(props);
  }

  renderCoverImage() {

    let {size, color} = this.props;
    let coverColor = "white";
    switch (color) {
      case "white":
      case "yellow":
      case "transparent":
        coverColor = "black";
        break;
    }

    switch (size) {
      case 'S':
        return <Products.S color={coverColor}/>;
      case 'M':
        return <Products.M color={coverColor}/>;
      case 'L':
      default:
        return <Products.L color={coverColor}/>;
    }
  }

  render() {

    let {highlight, size, color, ...other} = this.props;

    return (
      <div className="Previewer" {...other}>

        <figure
          className={"book highlight-" + highlight + " size-" + size.toLowerCase() + " color-" + color}>

          <ul className="cover front">
            <li>
              {this.renderCoverImage()}
              <div className="highlight"></div>
            </li>
            <li>
              <div className="highlight"></div>
            </li>
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
            <li>
              <div className="highlight"></div>
            </li>
            <li>
              <div className="highlight"></div>
            </li>
          </ul>

        </figure>

      </div>
    )
  }
}

Previewer.defaultProps = {
  color: "blue",
  size: "l"
};