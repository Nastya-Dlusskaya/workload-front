import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class AcademicDegree extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="academicDegree"
        buttonName="Добавить Степень"
      />
    );
  }
}

export default AcademicDegree;
