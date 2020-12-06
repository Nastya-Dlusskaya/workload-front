import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {
    BACK_END_SERVER_URL,
    LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
    LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN,
    LOCAL_STORAGE_USER_DATA,
    OAUTH2_CLIENT_ID,
    OAUTH2_CLIENT_SECRET,
    OAUTH2_GRANT_TYPE_PASSWORD,
    OAUTH2_GRANT_TYPE_REFRESH_TOKEN,
} from "../../context";
import axios from "axios";
import {Button, Form, Grid, Message,} from "semantic-ui-react";

const jwt = require("jsonwebtoken");

class SignIn extends Component {
    state = {
        username: "",
        password: "",
        expires_in: 0,
        errorMsg: "",
        authorities: [],
    };

    changeUsernameHandler = (event, {value}) => {
        this.setState({username: value});
    };

    changePasswordHandler = (event, {value}) => {
        this.setState({password: value});
    };


    formBody = (obj) => {
        let formBody = [];
        for (let property in obj) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(obj[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        return formBody.join("&");
    };

    signIn = () => {
        let details = {
            username: this.state.username,
            password: this.state.password,
            grant_type: OAUTH2_GRANT_TYPE_PASSWORD,
            client_id: OAUTH2_CLIENT_ID,
        };
        let client_secret = btoa(OAUTH2_CLIENT_ID + ":" + OAUTH2_CLIENT_SECRET);
        axios
            .post(BACK_END_SERVER_URL + `/oauth/token`, this.formBody(details), {
                headers: {
                    Authorization: "Basic " + client_secret,
                    "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
                },
            })
            .then((res) => {
                localStorage.setItem(
                    LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
                    res.data.access_token
                );
                localStorage.setItem(
                    LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN,
                    res.data.refresh_token
                );
                let decoded = jwt.decode(res.data.access_token);
                let userData = {
                    username: decoded.user_name,
                    authorities: decoded.authorities,
                };

                localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(userData));
                this.setState(
                    {
                        expires_in: res.data.expires_in,
                        authorities: userData.authorities,
                    },
                    this.loadUserData
                );

                this.startRefreshCycle();
                // this.setState({books: this.state.books.concat(res.data.content)});
                this.props.changeAuthorizeStatus();
                this.props.history.push("/");
            })
            .catch(({response}) => {
                this.setState({
                    errorMsg:
                        response.data.error_description === "exception.notFound.user"
                            ? "Введены недействительные данные"
                            : response.data.error_description,
                });
            });
    };

    loadUserData = () => {
        axios
            .get(BACK_END_SERVER_URL + `/user/data`, {
                headers: {
                    Authorization:
                        "Bearer  " +
                        localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                },
            })
            .then((res) => {
                let userData = res.data;
                userData.authorities = this.state.authorities;
                localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(userData));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    startRefreshCycle = () => {
        setTimeout(
            this.refreshToken.bind(this),
            (this.state.expires_in - 15) * 1000
        );
    };

    refreshToken = () => {
        console.log("try to get refresh token " + new Date());
        let client_secret = btoa(OAUTH2_CLIENT_ID + ":" + OAUTH2_CLIENT_SECRET);
        if (
            localStorage.getItem(LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN) !== null &&
            localStorage.getItem(LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN) !== undefined
        ) {
            let current = this;
            let data = {
                grant_type: OAUTH2_GRANT_TYPE_REFRESH_TOKEN,
                client_id: OAUTH2_CLIENT_ID,
                refresh_token: localStorage.getItem(LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN),
            };

            axios
                .post(BACK_END_SERVER_URL + `/oauth/token`, this.formBody(data), {
                    headers: {
                        Authorization: "Basic " + client_secret,
                        "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
                    },
                })
                .then((res) => {
                    localStorage.setItem(
                        LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
                        res.data.access_token
                    );
                    localStorage.setItem(
                        LOCAL_STORAGE_OAUTH2_REFRESH_TOKEN,
                        res.data.refresh_token
                    );
                    current.setState({expires_in: res.data.expires_in});
                    current.startRefreshCycle();
                    console.log("success");
                })
                .catch(function (error) {
                    console.log("refresh failed");
                    console.log(error);
                });
        }
    };

    render() {
        return (
            <div>
                <h2>Добро пожаловать</h2>
                <h1>в систему учета и анализа нагрузки преподавателя</h1>
                <Grid container columns={3}>
                    <Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                        <Form size='large' ref="form" onSubmit={this.signIn}>
                            <Form.Input
                                required={true}
                                icon="user"
                                iconPosition="left"
                                label="Email"
                                placeholder="Email"
                                value={this.state.username}
                                onChange={this.changeUsernameHandler}
                                validators={[
                                    "required",
                                ]}
                                errorMessages={[
                                    "Данное поле является обязательным для заполнения",
                                ]}
                            />
                            <Form.Input
                                required={true}
                                icon="lock"
                                iconPosition="left"
                                label="Пароль"
                                placeholder="Пароль"
                                type="password"
                                value={this.state.password}
                                onChange={this.changePasswordHandler}
                                validators={[
                                    "required",
                                ]}
                                errorMessages={[
                                    "Данное поле является обязательным для заполнения",
                                ]}
                            />
                            <Message
                                error
                                header='Ошибка!'
                                content={this.state.errorMsg}/>
                            <Button
                                className="submit"
                                content="Вход"
                                fluid
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default withRouter(SignIn);
