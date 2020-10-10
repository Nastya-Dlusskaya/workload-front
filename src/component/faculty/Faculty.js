import React, {Component} from 'react';
import axios from "axios/index";
import {
    BACK_END_SERVER_URL,
    DEFAULT_L10N_LANGUAGE,
    LOCAL_STORAGE_BASKET, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
    LOCAL_STORAGE_UI_LANGUAGE,
    LOCAL_STORAGE_USER_DATA, ROLE_LIBRARIAN,
    ROLE_OPERATOR,
    URL_DOWNLOAD_FILE
} from "../../context";
import {Table, Modal, Button, Form, Icon} from "semantic-ui-react";

class Faculty extends Component {

    state = {
        faculties: [],
        facultyName: '',
        id: null,
        open: false
    };

    componentWillMount() {
        axios
            .get(BACK_END_SERVER_URL + `/faculties`)
            .then(res => {
                this.setState({faculties: res.data});
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    }

    addSubject = () => {
        let url = this.state.id ? '/faculties/' + this.state.id : '/faculties';
        let method = this.state.id ? 'put' : 'post';
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                //  'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                'Content-type': 'application/json'
            },
            data: {
                name: this.state.facultyName
            }
        })
            .then(res => {
                if(this.state.id) {
                    this.state.faculties.find(s => s.id === this.state.id).name = res.data.name
                } else {
                    this.state.faculties.push(res.data);
                }
                this.setState({
                    open: false,
                    facultyName: ""
                })
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    }

    onUpdate = (faculty) => {
        this.setState({
            id: faculty.id,
            facultyName: faculty.name,
            open: true
        })
    }

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/faculties/${id}`, {
                headers: {
                    //'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                }
            })
            .then(res => {
                this.setState({id: null, faculties: this.state.faculties.filter(s => s.id !== id)});
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    }

    handleChangeName = (event, {value}) => {
        this.setState({facultyName: value});
    };

    render() {
        return (
            <div>
                <Modal
                    onClose={() => this.setState({open: false})}
                    onOpen={() => this.setState({open: true, id: null})}
                    open={this.state.open}
                    trigger={<Button>Добавить факультет</Button>}
                >
                    <Modal.Header>Добавить факультет</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Input fluid label='Название' placeholder='Название' onChange={this.handleChangeName}
                                            value={this.state.facultyName}/>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button content='Отменить' color='black' onClick={() => this.setState({open: false})}/>
                        <Button
                            content={this.state.id ? 'Обновить' : 'Сохранить'}
                            labelPosition='right'
                            icon='checkmark'
                            onClick={this.addSubject}
                            positive
                        />
                    </Modal.Actions>
                </Modal>
                <Table style={{marginTop: "5em"}} celled>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>Обновить</Table.HeaderCell>
                            <Table.HeaderCell>Удалить</Table.HeaderCell>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Название</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Object.values(this.state.faculties).map(
                            (faculty) => {
                                return (
                                    <Table.Row key={faculty.id}>
                                        <Table.Cell icon={<Icon name='edit'/>} onClick={() => this.onUpdate(faculty)}/>
                                        <Table.Cell icon={<Icon name='remove'/>} onClick={() => this.onRemove(faculty.id)}/>
                                        <Table.Cell>{faculty.id}</Table.Cell>
                                        <Table.Cell>{faculty.name}</Table.Cell>
                                    </Table.Row>
                                );
                            }
                        )}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default Faculty
