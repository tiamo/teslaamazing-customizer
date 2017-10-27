import React, {Component} from 'react';

export default class FirstScreen extends Component {
  render() {
    return (
      <div className="FirstScreen">
        <div className="FirstScreen-content">
          <div className="FirstScreen-heading">
            <span>Custom</span> Magnetic
          </div>
          <div className="FirstScreen-text">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
            euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcor
          </div>
          <button className="btn btn-lg btn-purple" onClick={this.props.onClick}>Create</button>
        </div>
      </div>
    );
  }
}