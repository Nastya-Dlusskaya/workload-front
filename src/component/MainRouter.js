import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import SignIn from "./sign/SignIn";
import SignOut from "./sign/SignOut";
import {LOCAL_STORAGE_USER_DATA} from "../context";
import Header from "./header/Header.js";
import Subject from "./subject/Subject";
import Speciality from "./speciality/Speciality";
import Faculty from "./faculty/Faculty";
import Department from "./departmet/Department";
import AcademicRank from "./academicRank/AcademicRank";
import AcademicDegree from "./academicDegree/AcademicDegree";
import Lecturer from "./lecturer/Lecturer";
import Group from "./group/Group";

class MainRouter extends Component {

    state = {
        isAuthorize: false,
    };

    componentWillMount() {
        let str = localStorage.getItem(LOCAL_STORAGE_USER_DATA);
        if (str && JSON.parse(str).username){
            this.setState({isAuthorize: true});
        }
    }

    changeAuthorizeStatus = () => {
        this.setState({isAuthorize: !this.state.isAuthorize});
    };

    render() {
        return (
            <div style={{ minHeight: '100vh'}}>
                <div style={{paddingBottom: '2.5rem'}}>
                    <BrowserRouter>
                        <Header isAuthorize={this.state.isAuthorize}/>
                        <Route path='/signIn' render={() => <SignIn changeAuthorizeStatus={this.changeAuthorizeStatus}/>}/>
                        <Route path='/subjects' component={Subject}/>
                        <Route path='/specialities' component={Speciality}/>
                        <Route path='/faculties' component={Faculty}/>
                        <Route path='/departments' component={Department}/>
                        <Route path='/ranks' component={AcademicRank}/>
                        <Route path='/degrees' component={AcademicDegree}/>
                        <Route path='/lecturers' component={Lecturer}/>
                        <Route path='/groups' component={Group}/>
                        <Route path='/signOut' render={() => <SignOut changeAuthorizeStatus={this.changeAuthorizeStatus}/>}/>
                    </BrowserRouter>
                </div>
                <Footer/>
            </div>
        );
    }
}

class Footer extends Component{
    render() {
        return (
            <footer style={{backgroundColor: 'black', color: 'white',position: 'absolute', bottom: 0, width: '100%', height: '2.5rem'}}>
                footer
            </footer>
        );
    }

}

export default MainRouter;