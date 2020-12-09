import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import SignIn from "./sign/SignIn";
import SignOut from "./sign/SignOut";
import { LOCAL_STORAGE_USER_DATA } from "../context";
import Header from "./header/Header.js";
import Subject from "./subject/Subject";
import Speciality from "./speciality/Speciality";
import Faculty from "./faculty/Faculty";
import Department from "./departmet/Department";
import AcademicRank from "./academicRank/AcademicRank";
import AcademicDegree from "./academicDegree/AcademicDegree";
import Lecturer from "./lecturer/Lecturer";
import Group from "./group/Group";
import Stream from "./stream/Stream";
import Workload from "./workload/Workload";
import Plan from "./plan/Plan";
import Position from "./position/Position";

class MainRouter extends Component {
  state = {
    isAuthorize: false,
  };

  componentWillMount() {
    let str = localStorage.getItem(LOCAL_STORAGE_USER_DATA);
    if (str && JSON.parse(str).username) {
      this.setState({ isAuthorize: true });
    }
  }

  changeAuthorizeStatus = () => {
    this.setState({ isAuthorize: !this.state.isAuthorize });
  };

  render() {
    return (
      <div style={{ minHeight: "100vh" }}>
        <div style={{ paddingBottom: "2.5rem" }}>
          <BrowserRouter>
            <Header isAuthorize={this.state.isAuthorize} />
            {/*<Route exact path="/">*/}
            {/*  <Redirect to="/signIn" />*/}
            {/*</Route>*/}
            <Route
              path="/signIn"
              render={() => (
                <SignIn changeAuthorizeStatus={this.changeAuthorizeStatus} />
              )}
            />
            <Route path="/subjects" component={Subject} />
            <Route path="/specialities" component={Speciality} />
            <Route path="/faculties" component={Faculty} />
            <Route path="/departments" component={Department} />
            <Route path="/ranks" component={AcademicRank} />
            <Route path="/degrees" component={AcademicDegree} />
            <Route path="/lecturers" component={Lecturer} />
            <Route path="/groups" component={Group} />
            <Route path="/streams" component={Stream} />
            <Route path="/workloads" component={Workload} />
            <Route path="/plans" component={Plan} />
            <Route path="/positions" component={Position} />
            <Route
              path="/signOut"
              render={() => (
                <SignOut changeAuthorizeStatus={this.changeAuthorizeStatus} />
              )}
            ></Route>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <footer
        style={{
          backgroundColor: "rgba(1, 110, 69, 0.3)",
          color: "white",
          position: "absolute",
          bottom: 0,
          width: "105%",
          height: "2.5rem",
        }}
      >
        <p
          style={{
            paddingLeft: 10,
            overflow: "hidden",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          БНТУ, ФИТР, ПОИСиТ, 2019-2020
        </p>
        <p
          style={{
            paddingRight: 10,
            overflow: "hidden",
            display: "inline-block",
            textAlign: "right",
          }}
        >
          Разработчик: Длусская Анастасия
        </p>
      </footer>
    );
  }
}

export default MainRouter;
