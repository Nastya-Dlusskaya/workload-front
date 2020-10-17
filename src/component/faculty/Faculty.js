import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Faculty extends Component {
  render() {
    return <SimpleCRUD url="faculties" buttonName="Добавить факультет" />;
  }
}

export default Faculty;
