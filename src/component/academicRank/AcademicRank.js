import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class AcademicRank extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="academicRank"
        buttonName="звание"
      />
    );
  }
}

export default AcademicRank;
