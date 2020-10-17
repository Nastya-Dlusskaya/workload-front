import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class AcademicDegree extends Component {
  render() {
    return <SimpleCRUD url="academicDegree" buttonName="Добавить Степень" />;
  }
}

export default AcademicDegree;
