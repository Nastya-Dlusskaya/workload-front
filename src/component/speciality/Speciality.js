import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Speciality extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="specialities"
        buttonName="Добавить Специальность"
      />
    );
  }
}

export default Speciality;
