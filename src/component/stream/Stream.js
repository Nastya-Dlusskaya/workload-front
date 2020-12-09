import React, { Component } from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Stream extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="streams"
        buttonName="поток"
      />
    );
  }
}

export default Stream;
