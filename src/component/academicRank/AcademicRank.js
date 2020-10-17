import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class AcademicRank extends Component {
  render() {
    return <SimpleCRUD url="academicRank" buttonName="Добавить Ранг" />;
  }
}

export default AcademicRank;
