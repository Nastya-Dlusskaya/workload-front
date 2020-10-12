import React, {Component} from 'react';
import axios from "axios/index";
import {BACK_END_SERVER_URL, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN} from "../../context";
import {Button, Form, Icon, Modal, Table} from "semantic-ui-react";

class SimpleCRUD extends Component {

    state = {
        list: [],
        name: '',
        id: null,
        open: false
    };
    static defaultProps = {
        buttonName: "Добавить",
    };

    componentWillMount() {
        axios
            .get(BACK_END_SERVER_URL + `/${this.props.url}`)
            .then(res => {
                this.setState({list: res.data});
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    }

    add = () => {
        let url = this.state.id ? `/${this.props.url}/${this.state.id}` : `/${this.props.url}`;
        let method = this.state.id ? 'put' : 'post';
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                 'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                'Content-type': 'application/json'
            },
            data: {
                name: this.state.name
            }
        })
            .then(res => {
                if (this.state.id) {
                    this.state.list.find(s => s.id === this.state.id).name = res.data.name
                } else {
                    this.state.list.push(res.data);
                }
                this.setState({
                    open: false,
                    id: null,
                    name: ''
                })
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    };

    onUpdate = (degree) => {
        this.setState({
            id: degree.id,
            name: degree.name,
            open: true
        })
    };

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/${this.props.url}/${id}`, {
                headers: {
                    'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                }
            })
            .then(res => {
                this.setState({id: null, name: '', list: this.state.list.filter(s => s.id !== id)});
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    };

    handleChangeName = (event, {value}) => {
        this.setState({name: value});
    };

    render() {
        return (
            <div>
                <Modal
                    onClose={() => this.setState({open: false})}
                    onOpen={() => this.setState({open: true, id: null})}
                    open={this.state.open}
                    trigger={<Button>{this.props.buttonName}</Button>}
                >
                    <Modal.Header>{this.props.buttonName}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form>
                                <Form.Input fluid label='Название' placeholder='Название' onChange={this.handleChangeName}
                                            value={this.state.name}/>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button content='Отменить' color='black' onClick={() => this.setState({open: false})}/>
                        <Button
                            content={this.state.id ? 'Обновить' : 'Сохранить'}
                            labelPosition='right'
                            icon='checkmark'
                            onClick={this.add}
                            positive
                        />
                    </Modal.Actions>
                </Modal>
                <Table celled>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Название</Table.HeaderCell>
                            <Table.HeaderCell>Обновить</Table.HeaderCell>
                            <Table.HeaderCell>Удалить</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Object.values(this.state.list).map(
                            (item) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell icon={<Icon name='edit'/>} onClick={() => this.onUpdate(item)}/>
                                        <Table.Cell icon={<Icon name='remove'/>}
                                                    onClick={() => this.onRemove(item.id)}/>
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

export default SimpleCRUD
