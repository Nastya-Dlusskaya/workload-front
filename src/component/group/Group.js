import React, {Component} from 'react';
import axios from "axios/index";
import {BACK_END_SERVER_URL} from "../../context";
import {Button, Form, Icon, Modal, Table} from "semantic-ui-react";

class Group extends Component {

    state = {
        groups: [],
        groupName: '',
        studentCount: null,
        specialityId: null,
        id: null,
        open: false
    };

    componentWillMount() {
        axios
            .get(BACK_END_SERVER_URL + `/groups`)
            .then(res => {
                this.setState({groups: res.data});
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    }

    componentDidMount() {
        this.loadSpecialities();
    };

    loadSpecialities = () => {
        axios
            .get(BACK_END_SERVER_URL + `/specialities`)
            .then(res => {
                let array = [];
                res.data.map(f => array.push({key: f.id, text: f.name, value: f.id}));
                this.setState({faculties: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    addSubject = () => {
        let url = this.state.id ? '/groups/' + this.state.id : '/groups';
        let method = this.state.id ? 'put' : 'post';
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                //  'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                'Content-type': 'application/json'
            },
            data: {
                name: this.state.groupName,
                studentCount: this.state.studentCount,
                speciality: {
                    id: this.state.specialityId,
                }
            }
        })
            .then(res => {
                if(this.state.id) {
                    this.state.groups.find(s => s.id === this.state.id).name = res.data.name
                } else {
                    this.state.groups.push(res.data);
                }
                this.setState({
                    open: false,
                    studentCount: null,
                    specialityId: null,
                    name: ""
                })
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    };

    onUpdate = (group) => {
        this.setState({
            id: group.id,
            groupName: group.name,
            studentCount: group.studentCount,
            specialityId: group.speciality.id,
            open: true
        })
    };

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/groups/${id}`, {
                headers: {
                    //'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                }
            })
            .then(res => {
                this.setState({id: null, groups: this.state.groups.filter(s => s.id !== id)});
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    };

    handleChangeName = (event, {value}) => {
        this.setState({groupName: value});
    };

    handleChangeFaculty = (event, {value}) => {
        this.setState({facultyId : value});
    };

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
                                            value={this.state.groupName}/>
                                <Form.Dropdown
                                    fluid
                                    search
                                    selection
                                    label='Факультет'
                                    options={this.state.faculties}
                                    defaultValue={this.state.facultyId}
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
                <Table celled>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>Обновить</Table.HeaderCell>
                            <Table.HeaderCell>Удалить</Table.HeaderCell>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Название</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Object.values(this.state.groups).map(
                            (dep) => {
                                return (
                                    <Table.Row key={dep.id}>
                                        <Table.Cell>{dep.id}</Table.Cell>
                                        <Table.Cell>{dep.name}</Table.Cell>
                                        <Table.Cell icon={<Icon name='edit'/>} onClick={() => this.onUpdate(dep)}/>
                                        <Table.Cell icon={<Icon name='remove'/>} onClick={() => this.onRemove(dep.id)}/>
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

export default Group
