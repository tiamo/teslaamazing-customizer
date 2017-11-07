import React from 'react';
import CustomMagnetic from "../Svg/CustomMagnetic";

export default ({onClick}) => (
  <div className="FirstScreen">
    <div className="FirstScreen-content">
      <div className="FirstScreen-heading">
        <CustomMagnetic/>
      </div>
      <div className="FirstScreen-text">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcor
      </div>
      <button className="btn btn-lg btn-purple" onClick={onClick}>Create</button>
    </div>
  </div>
);