import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL} from "../../context";
import {Button, Form, Modal} from "semantic-ui-react";

class Workload extends Component {
    state = {
        workloadType: [],
        educationWorkloadType: [],
        subjects: [],
        workloadTypeId: "",
        educationWorkloadTypeId: "",
        name: "",
        note: "",
        subjectId: null,
        date: null,
        hours: 0,
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

    handleChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({[name]: value});
        }
    }

    render() {
        return (
            <div style={{
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
                        trigger={<Button>Добавить нагрузку</Button>}
                    >
                        <Modal.Content>
                            <Modal.Description>
                                <Form ref="form" onSubmit={this.add}>
                                    <Modal.Header>Добавить нагрузку</Modal.Header>
                                    <Form.Dropdown
                                        fluid
                                        search
                                        selection
                                        name="workloadType"
                                        label="Тип работ"
                                        options={this.state.workloadType}
                                        defaultValue={this.state.workloadTypeId}
                                        validators={['required']}
                                        errorMessages={['Данное поле является обязательным для заполнения']}
                                        onChange={this.handleChange}
                                        placeholder="Тип работ"
                                    />
                                    <Form.Input
                                        fluid
                                        name="hours"
                                        label="Количество часов"
                                        placeholder="Количество часов"
                                        onChange={this.handleChange}
                                        value={this.state.hours}
                                        type="number"
                                        validators={[
                                            "required",
                                            "minNumber:1",
                                            "maxNumber:200",
                                        ]}
                                        errorMessages={[
                                            "Данное поле является обязательным для заполнения",
                                            "Минимальная длинна 1 символ",
                                            "Максимальная длинна 200 символов",
                                        ]}
                                    />
                                    <Form.Dropdown
                                        fluid
                                        search
                                        selection
                                        name="educationWorkloadTypeId"
                                        label="Тип ежедневной нарузки"
                                        options={this.state.educationWorkloadType}
                                        defaultValue={this.state.educationWorkloadTypeId}
                                        validators={['required']}
                                        errorMessages={['Данное поле является обязательным для заполнения']}
                                        onChange={this.handleChange}
                                        placeholder="Тип ежедневной нарузки"
                                    />
                                    <Form.Dropdown
                                        fluid
                                        search
                                        selection
                                        name="subjectId"
                                        label="Предмет"
                                        options={this.state.subjects}
                                        defaultValue={this.state.subjectId}
                                        validators={['required']}
                                        errorMessages={['Данное поле является обязательным для заполнения']}
                                        onChange={this.handleChange}
                                        placeholder="Предмет"
                                    />
                                    <Form.Input
                                        fluid
                                        name="name"
                                        label="Наименование работ"
                                        placeholder="Наименование работ"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                    />
                                    <Form.TextArea
                                        name='note'
                                        label='Примечание'
                                        placeholder='Примечание'
                                    />
                                    <Form.Input
                                        fluid
                                        name="date"
                                        label="Дата проведения"
                                        placeholder="Дата проведения"
                                        onChange={this.handleChange}
                                        value={this.state.date}
                                        type="date"
                                    />
                                    <Button
                                        content="Отменить"
                                        color="black"
                                        onClick={() => this.setState({open: false})}
                                    />
                                    <Button
                                        content={this.state.id ? "Обновить" : "Сохранить"}

                                        primary
                                    />
                                </Form>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                </div>

                {/*<Table celled style={{alignSelf: "center"}}>*/}
                {/*    <Table.Header fullWidth>*/}
                {/*        <Table.Row>*/}
                {/*            <Table.HeaderCell>Обновить</Table.HeaderCell>*/}
                {/*            <Table.HeaderCell>Удалить</Table.HeaderCell>*/}
                {/*            <Table.HeaderCell>Id</Table.HeaderCell>*/}
                {/*            <Table.HeaderCell>Название</Table.HeaderCell>*/}
                {/*            <Table.HeaderCell>Факультет</Table.HeaderCell>*/}
                {/*        </Table.Row>*/}
                {/*    </Table.Header>*/}

                {/*    <Table.Body>*/}
                {/*        {Object.values(this.state.departments).map((dep) => {*/}
                {/*            return (*/}
                {/*                <Table.Row key={dep.id}>*/}
                {/*                    <Table.Cell*/}
                {/*                        icon={<Icon name="edit"/>}*/}
                {/*                        onClick={() => this.onUpdate(dep)}*/}
                {/*                    />*/}
                {/*                    <Table.Cell*/}
                {/*                        icon={<Icon name="remove"/>}*/}
                {/*                        onClick={() => this.onRemove(dep.id)}*/}
                {/*                    />*/}
                {/*                    <Table.Cell>{dep.id}</Table.Cell>*/}
                {/*                    <Table.Cell>{dep.name}</Table.Cell>*/}
                {/*                    <Table.Cell>{dep.faculty.name}</Table.Cell>*/}
                {/*                </Table.Row>*/}
                {/*            );*/}
                {/*        })}*/}
                {/*    </Table.Body>*/}
                {/*</Table>*/}
                {/*<Pagin*/}
                {/*    loadList={this.loadList}*/}
                {/*    location={this.props.location}*/}
                {/*    totalPages={this.state.totalPages}*/}
                {/*    history={this.props.history}*/}
                {/*/>*/}
            </div>
        );
    }
}

export default Workload;
