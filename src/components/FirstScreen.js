import React, {Component} from 'react';
import {Fade} from 'reactstrap';

export default class FirstScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: !!props.active,
      fadeIn: true
    }
  }

  render() {
    return this.state.active && (
      <Fade className="FirstScreen" in={this.state.fadeIn} unmountOnExit={true}>
        <div className="FirstScreen-content">
          <div className="FirstScreen-heading">
            <span>Custom</span> Magnetic
          </div>
          <div className="FirstScreen-text">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
            euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcor
          </div>
          <button className="btn btn-lg btn-purple" onClick={this.handleClick}>Create</button>
        </div>
      </Fade>
    );
  }

  handleClick = e => {
    this.setState({fadeIn: false})
  }
}

FirstScreen.defaultProps = {
  active: true
};
