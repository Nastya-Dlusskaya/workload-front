import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL} from "../../context";
import {Button, Dropdown, Form, Modal, Table} from "semantic-ui-react";
import Pagin from "../simpleEntity/Pagin";

class Department extends Component {
    state = {
        departments: [],
        faculties: [],
        departmentName: "",
        facultyId: null,
        id: null,
        open: false,

        totalPages: 1,
    };

    loadList = (params) => {
        axios
            .get(BACK_END_SERVER_URL + `/departments/page`, {params: params})
            .then((res) => {
                this.setState({
                    departments: res.data.content,
                    totalPages: res.data.totalPages,
                });
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    };

    componentDidMount() {
        this.loadFaculties();
    }

    loadFaculties = () => {
        axios
            .get(BACK_END_SERVER_URL + `/faculties`)
            .then((res) => {
                let array = [];
                res.data.map((f) =>
                    array.push({key: f.id, text: f.name, value: f.id})
                );
                this.setState({faculties: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    addSubject = () => {
        let url = this.state.id ? "/departments/" + this.state.id : "/departments";
        let method = this.state.id ? "put" : "post";
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                //  'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                "Content-type": "application/json",
            },
            data: {
                name: this.state.departmentName,
                faculty: {
                    id: this.state.facultyId,
                },
            },
        })
            .then((res) => {
                if (this.state.id) {
                    this.state.departments.find((s) => s.id === this.state.id).name =
                        res.data.name;
                } else {
                    this.state.departments.push(res.data);
                }
                this.setState({
                    open: false,
                    facultyId: null,
                    departmentName: "",
                });
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    };

    onUpdate = (department) => {
        this.setState({
            id: department.id,
            departmentName: department.name,
            facultyId: department.faculty.id,
            open: true,
        });
    };

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/departments/${id}`, {
                headers: {
                    //'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                },
            })
            .then((res) => {
                this.setState({
                    id: null,
                    departments: this.state.departments.filter((s) => s.id !== id),
                });
            })
            .catch(({response}) => {
                this.setState({removeErrorText: response.data.message});
            });
    };

    handleChangeName = (event, {value}) => {
        this.setState({departmentName: value});
    };

    handleChangeFaculty = (event, {value}) => {
        this.setState({facultyId: value});
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
                }}>
                <div style={{alignSelf: "flex-end"}}>
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
                                    <Form.Input
                                        fluid
                                        label="Название"
                                        placeholder="Название"
                                        onChange={this.handleChangeName}
                                        value={this.state.departmentName}
                                    />
                                    <Form.Dropdown
                                        fluid
                                        search
                                        selection
                                        label="Факультет"
                                        options={this.state.faculties}
                                        defaultValue={this.state.facultyId}
                                        onChange={this.handleChangeFaculty}
                                        placeholder="Факультет"
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
                            <Table.HeaderCell>Факультет</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Object.values(this.state.departments).map((dep) => {
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
                                    <Table.Cell>{dep.faculty.name}</Table.Cell>
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

export default Department;
