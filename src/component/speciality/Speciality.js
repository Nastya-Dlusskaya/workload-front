import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Speciality extends Component {
  render() {
    return (
      <SimpleCRUD url="specialities" buttonName="Добавить Специальность" />
    );
  }
}

export default Speciality;
