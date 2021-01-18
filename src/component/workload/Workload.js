import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL, getPopupTitle, getUserId, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,} from "../../context";
import {Button, Checkbox, Dropdown as Drop, Modal, Table} from "semantic-ui-react";
import {Dropdown, Form, Input, TextArea,} from "semantic-ui-react-form-validator";
import {educationWorkloadType, educationWorkloadView, workloadType, workloadView} from "./WorkloadConstant";
import Pagin from "../simpleEntity/Pagin";

class Workload extends Component {
    state = {
        subjects: [],
        plans: [],
        workloads: [],
        workloadTypeId: null,
        educationWorkloadTypeId: null,
        name: "",
        note: "",
        resultForm: "",
        subjectId: null,
        startDate: null,
        endDate: null,
        workDate: null,
        hours: 0,
        id: null,
        isPlanned: false,
        isApproved: false,
        planId: null,
        open: false,

        totalPages: 1,
    };

    loadList = (params) => {
        axios
            .get(BACK_END_SERVER_URL + `/workloads/page`, {params: params})
            .then((res) => {
                this.setState({
                    workloads: res.data.content,
                    totalPages: res.data.totalPages,
                });
                console.log(this.state.workloads);
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    };

    componentDidMount() {
        this.loadSubject();
        this.loadPlans();
    }

    loadSubject = () => {
        axios
            .get(BACK_END_SERVER_URL + `/subjects`)
            .then((res) => {
                let array = [];
                res.data.map((f) =>
                    array.push({key: f.id, text: f.name, value: f.id})
                );
                this.setState({subjects: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    loadPlans = () => {
        axios
            .get(BACK_END_SERVER_URL + `/plans`)
            .then((res) => {
                let array = [];
                res.data.map((f) =>
                    array.push({key: f.id, text: f.name, value: f.id})
                );
                this.setState({plans: array});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    add = () => {
        let url = this.state.id ? "/workloads/" + this.state.id : "/workloads";
        let method = this.state.id ? "put" : "post";
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                Authorization:
                    "Bearer  " + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                "Content-type": "application/json",
            },
            data: {
                type: this.state.workloadTypeId,
                name: this.state.name,
                subject: {
                    id: this.state.subjectId,
                },
                amountHours: this.state.hours,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                workDate: this.state.workDate,
                resultType: this.state.educationWorkloadTypeId,
                resultForm: this.state.resultForm,
                approved: this.state.isApproved,
                isPlanned: this.state.isPlanned,
                note: this.state.note,
                lecturer: {
                    id: getUserId(),
                },
                plan: {
                    id: this.state.planId,
                    lecturer: {
                        id: getUserId(),
                    },
                },
            },
        })
            .then((res) => {
                if (this.state.id) {
                    this.state.workloads.find((s) => s.id === this.state.id).name =
                        res.data.name;
                } else {
                    this.state.workloads.push(res.data);
                }
                this.setState({
                    open: false,
                    workloadTypeId: null,
                    educationWorkloadTypeId: null,
                    name: "",
                    note: "",
                    subjectId: null,
                    startDate: null,
                    endDate: null,
                    workDate: null,
                    resultForm: "",
                    hours: 0,
                    id: null,
                    isPlanned: false,
                    isApproved: false,
                    planId: null,
                });
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    };

    onUpdate = (workload) => {
        this.setState({
            id: workload.id,
            workloadTypeId: workload.type,
            educationWorkloadTypeId: workload.resultType,
            name: workload.name,
            note: workload.note,
            resultForm: workload.resultForm,
            subjectId: workload.subject?.id,
            startDate: workload.startDate,
            endDate: workload.endDate,
            workDate: workload.workDate,
            hours: workload.amountHours,
            isPlanned: workload.isPlanned,
            isApproved: workload.approved,
            planId: workload.plan.id,
            open: true,
        });
    };

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/workloads/${id}`, {
                headers: {
                    Authorization:
                        "Bearer  " +
                        localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                },
            })
            .then((res) => {
                this.setState({
                    id: null,
                    workloads: this.state.workloads.filter((s) => s.id !== id),
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
    };

    render() {
        return (
            <div className="workload">
                <div style={{alignSelf: "flex-end"}}>
                    <Modal
                        className="workloadModal"
                        onClose={() => this.setState({open: false})}
                        onOpen={() => this.setState({open: true, id: null})}
                        open={this.state.open}
                        trigger={<Button>Добавить нагрузку</Button>}
                    >
                        <Modal.Header>
                            {getPopupTitle(this.state.id) + "нагрузку"}
                        </Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <Form ref="form" onSubmit={this.add}>
                                    <div className="formGroupRow">
                                        <Dropdown
                                            search
                                            selection
                                            name="planId"
                                            label="План"
                                            options={this.state.plans}
                                            defaultValue={this.state.planId}
                                            value={this.state.planId}
                                            validators={["required"]}
                                            errorMessages={[
                                                "Данное поле является обязательным для заполнения",
                                            ]}
                                            onChange={this.handleChange}
                                            placeholder="План"
                                        />
                                        <Dropdown
                                            search
                                            selection
                                            name="workloadTypeId"
                                            label="Тип работ"
                                            options={workloadType}
                                            defaultValue={this.state.workloadTypeId}
                                            value={this.state.workloadTypeId}
                                            validators={["required"]}
                                            errorMessages={[
                                                "Данное поле является обязательным для заполнения",
                                            ]}
                                            onChange={this.handleChange}
                                            placeholder="Тип работ"
                                        />
                                    </div>
                                    <Input
                                        fluid
                                        name="hours"
                                        label="Количество часов"
                                        placeholder="Количество часов"
                                        onChange={this.handleChange}
                                        value={this.state.hours}
                                        type="number"
                                        validators={["required", "minNumber:1", "maxNumber:360"]}
                                        errorMessages={[
                                            "Данное поле является обязательным для заполнения",
                                            "Минимальное значение - 1",
                                            "Минимальное значение - 360",
                                        ]}
                                    />
                                    {this.state.workloadTypeId === "EDUCATION" ? (
                                        <div className="formGroupRow">
                                            <Dropdown
                                                fluid
                                                search
                                                selection
                                                name="educationWorkloadTypeId"
                                                label="Тип ежедневной нарузки"
                                                options={educationWorkloadType}
                                                defaultValue={this.state.educationWorkloadTypeId}
                                                value={this.state.educationWorkloadTypeId}
                                                validators={["required"]}
                                                errorMessages={[
                                                    "Данное поле является обязательным для заполнения",
                                                ]}
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
                                                value={this.state.subjectId}
                                                validators={["required"]}
                                                errorMessages={[
                                                    "Данное поле является обязательным для заполнения",
                                                ]}
                                                onChange={this.handleChange}
                                                placeholder="Предмет"
                                            />
                                        </div>
                                    ) : false}
                                    {this.state.workloadTypeId !== "EDUCATION" ? (
                                        <Input
                                            fluid
                                            name="name"
                                            label="Наименование работ"
                                            placeholder="Наименование работ"
                                            onChange={this.handleChange}
                                            value={this.state.name}
                                        />) : false}
                                    {this.state.workloadTypeId === "SCIENTIFIC_RESEARCH" ? (
                                        <Input
                                            fluid
                                            name="resultForm"
                                            label="Форма отчётности"
                                            placeholder="Форма отчётности"
                                            onChange={this.handleChange}
                                            value={this.state.resultForm}
                                        />) : false}
                                    {this.state.workloadTypeId === "EDUCATION" ? (
                                        <Input
                                            fluid
                                            name="workDate"
                                            label="Дата проведения"
                                            placeholder="Дата проведения"
                                            onChange={this.handleChange}
                                            value={this.state.workDate}
                                            type="date"
                                        />) : false}
                                    {this.state.workloadTypeId !== "EDUCATION" ? (
                                        <div className="formGroupRow">
                                            <Input
                                                fluid
                                                name="startDate"
                                                label="Начало выполнения"
                                                placeholder="Начало выполнения"
                                                onChange={this.handleChange}
                                                value={this.state.startDate}
                                                type="date"
                                            />
                                            <Input
                                                fluid
                                                name="endDate"
                                                label="Конец выполнения"
                                                placeholder="Конец выполнения"
                                                onChange={this.handleChange}
                                                value={this.state.endDate}
                                                type="date"
                                            />
                                        </div>) : false}
                                    <TextArea
                                        name="note"
                                        label="Примечание"
                                        placeholder="Примечание"
                                    />
                                    {this.state.workloadTypeId === "EDUCATION" ? (
                                    <Checkbox
                                        name="isPlanned"
                                        label="Запланированная нагрузка"
                                        onChange={this.handleChange}
                                        value={this.state.isPlanned}/>) : false}
                                    {this.state.workloadTypeId !== "EDUCATION" ? (
                                    <Checkbox
                                        name="isApproved"
                                        label="Отмечено кафедрой о выполнении"
                                        onChange={this.handleChange}
                                        value={this.state.isApproved}/>):false}
                                    <div className="ui divider"></div>
                                    <div className="buttons">
                                        <Button
                                            content={this.state.id ? "Редактировать" : "Сохранить"}
                                        />
                                        <Button
                                            content="Отменить"
                                            onClick={() => this.setState({
                                                open: false,
                                                workloadTypeId: null,
                                                educationWorkloadTypeId: null,
                                                name: "",
                                                note: "",
                                                subjectId: null,
                                                startDate: null,
                                                endDate: null,
                                                workDate: null,
                                                hours: 0,
                                                id: null,
                                                isPlanned: false,
                                                isApproved: false,
                                                planId: null,
                                            })}
                                            secondary
                                        />
                                    </div>
                                </Form>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>
                </div>

                <Table celled style={{alignSelf: "center"}}>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Тип</Table.HeaderCell>
                            <Table.HeaderCell>Наименование</Table.HeaderCell>
                            <Table.HeaderCell>Дата проведения</Table.HeaderCell>
                            <Table.HeaderCell>Кол-во часов</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.workloads.map((workload) => {
                            return (
                                <Table.Row key={workload.id}>
                                    <Table.Cell style={{width: 7}}>
                                        <Drop icon="ellipsis horizontal">
                                            <Drop.Menu>
                                                <Drop.Item
                                                    text="Редактировать"
                                                    onClick={() => this.onUpdate(workload)}
                                                />
                                                <Drop.Item
                                                    text="Удалить"
                                                    onClick={() => this.onRemove(workload.id)}
                                                />
                                            </Drop.Menu>
                                        </Drop>
                                    </Table.Cell>
                                    <Table.Cell>{workloadView.get(workload.type) ? workloadView.get(workload.type).name : ""}</Table.Cell>
                                    <Table.Cell>{workload.name ? workload.name : workload.subject.name + " (" + this.getName(workload) + ")"}</Table.Cell>
                                    <Table.Cell>{this.getUiDate(workload)}</Table.Cell>
                                    <Table.Cell>{workload.amountHours}</Table.Cell>
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

    getUiDate(workload) {
        return workload.workDate ? this.reverseDate(workload.workDate) : workload.startDate? this.reverseDate(workload.startDate) + "-" + this.reverseDate(workload.endDate) : "";
    }

    reverseDate(date) {
        let stringDate = date + '';
        return stringDate.split('-').reverse().join('-');
    }

    getName(workload) {
        return educationWorkloadView.get(workload.resultType) ? educationWorkloadView.get(workload.resultType).name : "";
    }
}

export default Workload;
