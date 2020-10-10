import React, {Component} from 'react';
import axios from "axios/index";
import { BACK_END_SERVER_URL } from "../../context";
import {Table, Modal, Button, Form, Icon} from "semantic-ui-react";

class Subject extends Component {

    state = {
        subjects: [],
        subjectName: '',
        id: null,
        open: false
    };

    componentWillMount() {
        axios
            .get(BACK_END_SERVER_URL + `/subjects`)
            .then(res => {
                this.setState({degrees: res.data});
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    }

    addSubject = () => {
        console.log('add')
        let url = this.state.id ? '/degrees/' + this.state.id : '/degrees';
        let method = this.state.id ? 'put' : 'post';
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                //  'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                'Content-type': 'application/json'
            },
            data: {
                name: this.state.subjectName
            }
        })
            .then(res => {
                if (this.state.id) {
                    this.state.subjects.find(s => s.id === this.state.id).name = res.data.name
                } else {
                    this.state.subjects.push(res.data);
                }
                this.setState({open: false})
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    }

    onUpdate = (subject) => {
        this.setState({
            id: subject.id,
            degreeName: subject.name,
            open: true
        })
    }

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/subjects/${id}`, {
                headers: {
                    //'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                }
            })
            .then(res => {
                this.setState({id: null, degreeName: '', degrees: this.state.subjects.filter(s => s.id !== id)});
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    }

    handleChangeName = (event, {value}) => {
        this.setState({degreeName: value});
    };

    render() {
        return (
            <div>
                <Modal
                    onClose={() => this.setState({open: false})}
                    onOpen={() => this.setState({open: true, id: null})}
                    open={this.state.open}
                    trigger={<Button>Добавить предмет</Button>}
                >
                    <Modal.Header>Добавить предмет</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Input fluid label='Название' placeholder='Название' onChange={this.handleChangeName}
                                            value={this.state.subjectName}/>
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
                        {Object.values(this.state.subjects).map(
                            (subject) => {
                                return (
                                    <Table.Row>
                                        <Table.Cell icon={<Icon name='edit'/>} onClick={() => this.onUpdate(subject)}/>
                                        <Table.Cell icon={<Icon name='remove'/>}
                                                    onClick={() => this.onRemove(subject.id)}/>
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

export default Subject
