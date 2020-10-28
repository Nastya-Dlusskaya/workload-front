import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN} from "../../context";
import {Button, Dropdown, Form, Modal, Table} from "semantic-ui-react";
import Pagin from "../simpleEntity/Pagin";

class Group extends Component {
    state = {
        groups: [],
        groupName: "",
        studentCount: null,
        specialityId: null,
        specialities: [],
        streamId: null,
        streams: [],
        id: null,
        open: false,

        totalPages: 1,
    };

    loadList = (params) => {
        axios
            .get(BACK_END_SERVER_URL + `/groups/page`, {params: params})
            .then((res) => {
                this.setState({
                    groups: res.data.content,
                    totalPages: res.data.totalPages,
                });
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    };

    componentDidMount() {
        this.loadSpecialities();
        this.loadStreams();
    }

    loadSpecialities = () => {
        axios
            .get(BACK_END_SERVER_URL + `/specialities`)
            .then((res) => {
                let array = [];
                res.data.map((f) =>
                    array.push({key: f.id, text: f.name, value: f.id})
                );
                this.setState({specialities: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    loadStreams = () => {
        axios
            .get(BACK_END_SERVER_URL + `/streams`)
            .then((res) => {
                let array = [];
                res.data.map((f) =>
                    array.push({key: f.id, text: f.name, value: f.id})
                );
                this.setState({streams: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    addSubject = () => {
        let url = this.state.id ? "/groups/" + this.state.id : "/groups";
        let method = this.state.id ? "put" : "post";
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                "Content-type": "application/json",
            },
            data: {
                name: this.state.groupName,
                studentCount: this.state.studentCount,
                speciality: {
                    id: this.state.specialityId,
                },
                stream: {
                    id: this.state.streamId,
                },
            },
        })
            .then((res) => {
                if (this.state.id) {
                    this.state.groups.find((s) => s.id === this.state.id).name =
                        res.data.name;
                } else {
                    this.state.groups.push(res.data);
                }
                this.setState({
                    open: false,
                    studentCount: null,
                    specialityId: null,
                    streamId: null,
                    name: "",
                });
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
            streamId: group.stream.id,
            open: true,
        });
    };

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/groups/${id}`, {
                headers: {
                    //'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                },
            })
            .then((res) => {
                this.setState({
                    id: null,
                    groups: this.state.groups.filter((s) => s.id !== id),
                });
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    };

    handleChangeName = (event, {value}) => {
        this.setState({groupName: value});
    };

    handleChangeStudentCount = (event, {value}) => {
        this.setState({studentCount: value});
    };

    handleChangeSpeciality = (event, {value}) => {
        this.setState({specialityId: value});
    };

    handleChangeStream = (event, {value}) => {
        this.setState({streamId: value});
    };

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "500px",
                    maxWidth: "1300px",
                    width: "100%",
                    margin: "10px auto",
                }}
            >
                <div style={{alignSelf: "flex-end"}}>
                    <Modal
                        onClose={() => this.setState({open: false})}
                        onOpen={() => this.setState({open: true, id: null})}
                        open={this.state.open}
                        trigger={<Button>Добавить группу</Button>}
                    >
                        <Modal.Header>Добавить группу</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <Form>
                                    <Form.Input
                                        fluid
                                        label="Название"
                                        placeholder="Название"
                                        onChange={this.handleChangeName}
                                        value={this.state.groupName}
                                    />
                                    <Form.Input
                                        fluid
                                        label="Количество студентов"
                                        placeholder="Количество студентов"
                                        onChange={this.handleChangeStudentCount}
                                        value={this.state.studentCount}
                                        type="number"
                                        min="1"
                                        max="50"
                                    />
                                    <Form.Dropdown
                                        fluid
                                        search
                                        selection
                                        label="Специальность"
                                        options={this.state.specialities}
                                        defaultValue={this.state.specialityId}
                                        onChange={this.handleChangeSpeciality}
                                        placeholder="Специальность"
                                    />
                                    <Form.Dropdown
                                        fluid
                                        search
                                        selection
                                        label="Поток"
                                        options={this.state.streams}
                                        defaultValue={this.state.streamId}
                                        onChange={this.handleChangeStream}
                                        placeholder="Поток"
                                    />
                                </Form>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button
                                content={this.state.id ? "Обновить" : "Сохранить"}
                                onClick={this.addSubject}
                            />
                            <Button
                                content="Отменить"
                                onClick={() => this.setState({open: false})}
                                secondary
                            />
                        </Modal.Actions>
                    </Modal>
                </div>

                <Table celled style={{alignSelf: "center"}}>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Название</Table.HeaderCell>
                            <Table.HeaderCell singleLine={false}>Кол-во студентов</Table.HeaderCell>
                            <Table.HeaderCell>Специальность</Table.HeaderCell>
                            <Table.HeaderCell>Поток</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Object.values(this.state.groups).map((dep) => {
                            return (
                                <Table.Row key={dep.id}>
                                    <Table.Cell width={1}>
                                        <Dropdown icon="ellipsis horizontal">
                                            <Dropdown.Menu>
                                                <Dropdown.Item text="Редактировать" onClick={() => this.onUpdate(dep)}/>
                                                <Dropdown.Item text="Удалить" onClick={() => this.onRemove(dep.id)}/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Table.Cell>
                                    <Table.Cell>{dep.name}</Table.Cell>
                                    <Table.Cell>{dep.studentCount}</Table.Cell>
                                    <Table.Cell>{dep.speciality.name}</Table.Cell>
                                    <Table.Cell>{dep.stream.name}</Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
                <Pagin
                    loadList={this.loadList}
                    location={this.props.location}
                    totalPages={this.state.totalPages}
                    history={this.props.history}
                />
            </div>
        );
    }
}

export default Group;
