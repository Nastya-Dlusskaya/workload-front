import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Subject extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="subjects"
        buttonName="предмет"
      />
    );
  }
}

export default Subject;
