import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL, getPopupTitle, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN} from "../../context";
import {Button, Modal} from "semantic-ui-react";
import {Dropdown, Form, Input, TextArea} from "semantic-ui-react-form-validator";

const workloadType = [
    {
        key: 'EDUCATION',
        text: 'Учебная',
        value: 'EDUCATION',
    },
    {
        key: 'EDUCATION_METHODICAL',
        text: 'Учебно-методическая',
        value: 'EDUCATION_METHODICAL',
    },
    {
        key: 'ORGANIZATIONAL_METHODICAL',
        text: 'Организационно – методическая',
        value: 'ORGANIZATIONAL_METHODICAL',
    },
    {
        key: 'SCIENTIFIC_RESEARCH',
        text: 'Научно – исследовательская',
        value: 'SCIENTIFIC_RESEARCH',
    },
    {
        key: 'SOCIAL',
        text: 'Информационно – воспитательная, общественная и идеологическая',
        value: 'SOCIAL',
    },
]

const educationWorkloadType = [
    {
        key: 'LECTURE',
        text: 'Лекции',
        value: 'LECTURE',
    },
    {
        key: 'PRACTISE',
        text: 'Практические и семинарские занятия',
        value: 'PRACTISE',
    },
    {
        key: 'LABORATORY',
        text: 'Лабораторные занятия',
        value: 'LABORATORY',
    },
    {
        key: 'COURSEWORK',
        text: 'Курсовое проектирование',
        value: 'COURSEWORK',
    },
    {
        key: 'CONSULTATION',
        text: 'Консультации',
        value: 'CONSULTATION',
    },
    {
        key: 'SET_OFF',
        text: 'Зачёт',
        value: 'SET_OFF',
    },
    {
        key: 'EXAM',
        text: 'Экзамены',
        value: 'EXAM',
    },
    {
        key: 'POST_GRADUATE',
        text: 'Лабораторные занятия',
        value: 'POST_GRADUATE',
    },
    {
        key: 'DIPLOMA',
        text: 'Дипломное проектирование',
        value: 'DIPLOMA',
    },
    {
        key: 'EXAM_COMMITTEE',
        text: 'ГЭК',
        value: 'EXAM_COMMITTEE',
    },
    {
        key: 'FIELD_TRIP',
        text: 'Производственные и учебные практики',
        value: 'FIELD_TRIP',
    },
    {
        key: 'ATTENDANCE',
        text: 'Контрольное посещение занятий',
        value: 'ATTENDANCE',
    },
    {
        key: 'REVIEW',
        text: 'Рецензирование контрольных работ',
        value: 'REVIEW',
    },
]

class Workload extends Component {
    state = {
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
                'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
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
            .delete(BACK_END_SERVER_URL + `/workloads/${id}`, {
                headers: {
                    'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
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
                        <Modal.Header>{ getPopupTitle(this.state.id) + 'нагрузку'}</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <Form ref="form" onSubmit={this.add}>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        name="workloadType"
                                        label="Тип работ"
                                        options={workloadType}
                                        defaultValue={this.state.workloadTypeId}
                                        validators={['required']}
                                        errorMessages={['Данное поле является обязательным для заполнения']}
                                        onChange={this.handleChange}
                                        placeholder="Тип работ"
                                    />
                                    <Input
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
                                            "maxNumber:360",
                                        ]}
                                        errorMessages={[
                                            "Данное поле является обязательным для заполнения",
                                            "Минимальная длинна 1 символ",
                                            "Максимальная длинна 360 символов",
                                        ]}
                                    />
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        name="educationWorkloadTypeId"
                                        label="Тип ежедневной нарузки"
                                        options={educationWorkloadType}
                                        defaultValue={this.state.educationWorkloadTypeId}
                                        validators={['required']}
                                        errorMessages={['Данное поле является обязательным для заполнения']}
                                        onChange={this.handleChange}
                                        placeholder="Тип ежедневной нарузки"
                                    />
                                    <Dropdown
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
                                    <Input
                                        fluid
                                        name="name"
                                        label="Наименование работ"
                                        placeholder="Наименование работ"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                    />
                                    <Input
                                        fluid
                                        name="date"
                                        label="Дата проведения"
                                        placeholder="Дата проведения"
                                        onChange={this.handleChange}
                                        value={this.state.date}
                                        type="date"
                                    />
                                    <Input
                                        fluid
                                        name="startDate"
                                        label="Начало выполнения"
                                        placeholder="Начало выполнения"
                                        onChange={this.handleChange}
                                        value={this.state.date}
                                        type="date"
                                    />
                                    <Input
                                        fluid
                                        name="endDate"
                                        label="Конец выполнения"
                                        placeholder="Конец выполнения"
                                        onChange={this.handleChange}
                                        value={this.state.date}
                                        type="date"
                                    />
                                    <TextArea
                                        name='note'
                                        label='Примечание'
                                        placeholder='Примечание'
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
