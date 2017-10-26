import React, {Component} from "react";

export default class Previewer extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let {highlight, size, color, ...other} = this.props;

    return (
      <div className="Previewer" {...other}>

          <figure className={"book highlight-"+ highlight +" size-" + size + " color-" + color}>

            <ul className="cover front">
              <li>
                <div className="image"></div>
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