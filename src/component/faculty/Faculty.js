import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Faculty extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="faculties"
        buttonName="факультет"
      />
    );
  }
}

export default Faculty;
