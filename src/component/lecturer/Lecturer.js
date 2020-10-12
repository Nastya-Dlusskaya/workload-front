import React, {Component} from 'react';
import axios from "axios/index";
import {BACK_END_SERVER_URL, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN} from "../../context";
import {Button, Form, Icon, Modal, Table} from "semantic-ui-react";

class Lecturer extends Component {

    state = {
        lecturers: [],
        degrees: [],
        ranks: [],
        lecturerSurname: '',
        lecturerName: '',
        lecturerPatronymic: '',
        lecturerEmail: '',
        rankId: null,
        degreeId: null,
        id: null,
        open: false
    };

    componentWillMount() {
        axios
            .get(BACK_END_SERVER_URL + `/lecturers`)
            .then(res => {
                this.setState({lecturers: res.data});
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    }

    componentDidMount() {
        this.loadDegrees();
        this.loadRanks();
    };

    loadDegrees = () => {
        axios
            .get(BACK_END_SERVER_URL + `/academicDegree`)
            .then(res => {
                let array = [];
                res.data.map(f => array.push({key: f.id, text: f.name, value: f.id}));
                this.setState({degrees: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    loadRanks = () => {
        axios
            .get(BACK_END_SERVER_URL + `/academicRank`)
            .then(res => {
                let array = [];
                res.data.map(f => array.push({key: f.id, text: f.name, value: f.id}));
                this.setState({ranks: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    addSubject = () => {
        let url = this.state.id ? '/lecturers/' + this.state.id : '/lecturers';
        let method = this.state.id ? 'put' : 'post';
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                'Content-type': 'application/json'
            },
            data: {
                surname: this.state.lecturerSurname,
                name: this.state.lecturerName,
                patronymic: this.state.lecturerPatronymic,
                email: this.state.lecturerEmail,
                academicDegree: {
                    id: this.state.degreeId
                },
                academicRank: {
                    id: this.state.rankId
                }
            }
        })
            .then(res => {
                if (this.state.id) {
                    this.state.lecturers.find(s => s.id === this.state.id).surname = res.data.surname
                } else {
                    this.state.lecturers.push(res.data);
                }
                this.setState({
                    open: false,
                    lecturerName: '',
                    lecturerSurname: '',
                    lecturerPatronymic: '',
                    lecturerEmail: '',
                    degreeId: null,
                    rankId: null
                })
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    }

     onUpdate = (lecturer) => {
        this.setState({
            id: lecturer.id,
            lecturerSurname: lecturer.surname,
            lecturerName: lecturer.name,
            lecturerPatronymic: lecturer.patronymic,
            lecturerEmail: lecturer.email,
            degreeId: lecturer.academicDegree.id,
            rankId: lecturer.academicRank.id,
            open: true
        })
    }

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/lecturers/${id}`, {
                headers: {
                    'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                }
            })
            .then(res => {
                this.setState({id: null, lecturers: this.state.lecturers.filter(s => s.id !== id)});
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    }

    handleChangeSurname = (event, {value}) => {
        this.setState({lecturerSurname: value});
    };

    handleChangeName = (event, {value}) => {
        this.setState({lecturerName: value});
    };

    handleChangePatronymic = (event, {value}) => {
        this.setState({lecturerPatronymic: value});
    };

    handleChangeEmail = (event, {value}) => {
        this.setState({lecturerEmail: value});
    };

    handleChangeRank = (event, {value}) => {
        this.setState({rankId : value});
    };

    handleChangeDegree = (event, {value}) => {
        this.setState({degreeId : value});
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
                                <Form.Input fluid label='Фамилия' placeholder='Фамилия'
                                            onChange={this.handleChangeSurname}
                                            value={this.state.lecturerSurname}/>
                                <Form.Input fluid label='Имя' placeholder='Имя' onChange={this.handleChangeName}
                                            value={this.state.lecturerName}/>
                                <Form.Input fluid label='Отчество' placeholder='Отчество'
                                            onChange={this.handleChangePatronymic}
                                            value={this.state.lecturerPatronymic}/>
                                <Form.Input fluid label='Почта' placeholder='Почта' onChange={this.handleChangeEmail}
                                            value={this.state.lecturerEmail}/>
                                <Form.Dropdown
                                    fluid
                                    search
                                    selection
                                    label='Ученое звание'
                                    options={this.state.degrees}
                                    defaultValue={this.state.degreeId}
                                    onChange={this.handleChangeRank}
                                    placeholder='Ученое звание'
                                />
                                <Form.Dropdown
                                fluid
                                search
                                selection
                                label='Ученая степень'
                                options={this.state.ranks}
                                defaultValue={this.state.rankId}
                                onChange={this.handleChangeDegree}
                                placeholder='Ученая степень'
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
                            <Table.HeaderCell>Фамилия</Table.HeaderCell>
                            <Table.HeaderCell>Имя</Table.HeaderCell>
                            <Table.HeaderCell>Отчество</Table.HeaderCell>
                            <Table.HeaderCell>Почта</Table.HeaderCell>
                            <Table.HeaderCell>Ученая степень</Table.HeaderCell>
                            <Table.HeaderCell>Ученое звание</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.values(this.state.lecturers).map(
                            (lecturer) => {
                                return (
                                    <Table.Row key={lecturer.id}>
                                        <Table.Cell icon={<Icon name='edit'/>} onClick={() => this.onUpdate(lecturer)}/>
                                        <Table.Cell icon={<Icon name='remove'/>}
                                                    onClick={() => this.onRemove(lecturer.id)}/>
                                        <Table.Cell>{lecturer.id}</Table.Cell>
                                        <Table.Cell>{lecturer.surname}</Table.Cell>
                                        <Table.Cell>{lecturer.name}</Table.Cell>
                                        <Table.Cell>{lecturer.patronymic}</Table.Cell>
                                        <Table.Cell>{lecturer.email}</Table.Cell>
                                        <Table.Cell>{lecturer.academicDegree.name}</Table.Cell>
                                        <Table.Cell>{lecturer.academicRank.name}</Table.Cell>
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

export default Lecturer
