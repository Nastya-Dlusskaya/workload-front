import React, {Component} from 'react';
import {Route, BrowserRouter} from 'react-router-dom'
import SignIn from "./sign/SignIn";
import SignOut from "./sign/SignOut";
import {LOCAL_STORAGE_USER_DATA} from "../context";
import Header from "./header/Header.js";
import Subject from "./subject/Subject";

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
            <div style={{position: 'relative', minHeight: '100vh'}}>
                <div style={{paddingBottom: '2.5rem'}}>
                    <BrowserRouter>
                        <Header isAuthorize={this.state.isAuthorize}/>
                        <Route path='/signIn' render={() => <SignIn changeAuthorizeStatus={this.changeAuthorizeStatus}/>}/>
                        <Route path='/subjects' component={Subject}/>
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