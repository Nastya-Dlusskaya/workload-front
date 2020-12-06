import React, {Component} from "react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Position extends Component {
  render() {
    return (
      <SimpleCRUD
        location={this.props.location}
        history={this.props.history}
        url="positions"
        buttonName="должность"
      />
    );
  }
}

export default Position;
