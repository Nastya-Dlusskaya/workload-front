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

class Department extends Component {

    state = {
        departments: [],
        faculties: [],
        departmentName: '',
        facultyId: null,
        id: null,
        open: false
    };

    componentWillMount() {
        axios
            .get(BACK_END_SERVER_URL + `/departments`)
            .then(res => {
                this.setState({departments: res.data});
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    }

    componentDidMount() {
        this.loadLanguageList();
    };

    loadLanguageList = () => {
        axios
            .get(BACK_END_SERVER_URL + `/faculties`)
            .then(res => {
                let array = [];
                res.data.map(l => array.push({key: l.id, text: l.name, value: l}));
                this.setState({faculties: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    addSubject = () => {
        let url = this.state.id ? '/departments/' + this.state.id : '/departments';
        let method = this.state.id ? 'put' : 'post';
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                //  'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                'Content-type': 'application/json'
            },
            data: {
                name: this.state.departmentName
            }
        })
            .then(res => {
                if(this.state.id) {
                    this.state.departments.find(s => s.id === this.state.id).name = res.data.name
                } else {
                    this.state.departments.push(res.data);
                }
                this.setState({open: false})
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    }

    onUpdate = (department) => {
        this.setState({
            id: department.id,
            departmentName: department.name,
            open: true
        })
    }

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/departments/${id}`, {
                headers: {
                    //'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                }
            })
            .then(res => {
                this.setState({id: null, departments: this.state.departments.filter(s => s.id !== id)});
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    }

    handleChangeName = (event, {value}) => {
        this.setState({departmentName: value});
    };

    handleChangeFaculty = (event, {value}) => {
        this.setState({facultyId : value});
    }

    render() {
        return (
            <div>
                <Modal
                    onClose={() => this.setState({open: false})}
                    onOpen={() => this.setState({open: true, id: null})}
                    open={this.state.open}
                    trigger={<Button>Добавить кафедру</Button>}
                >
                    <Modal.Header>Добавить кафедру</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Input fluid label='Название' placeholder='Название' onChange={this.handleChangeName}
                                            value={this.state.departmentName}/>
                                <Form.Dropdown
                                    fluid
                                    search
                                    selection
                                    label='Факультет'
                                    options={this.state.faculties}
                                    onChange={this.handleChangeFaculty}
                                    placeholder='Факультет'
                                />
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
                            (subject) => {
                                return (
                                    <Table.Row>
                                        <Table.Cell icon={<Icon name='edit'/>} onClick={() => this.onUpdate(subject)}/>
                                        <Table.Cell icon={<Icon name='remove'/>} onClick={() => this.onRemove(subject.id)}/>
                                        <Table.Cell>{subject.id}</Table.Cell>
                                        <Table.Cell>{subject.name}</Table.Cell>
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

export default Department
