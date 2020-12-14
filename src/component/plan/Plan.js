import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL, getPopupTitle, getUserId, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,} from "../../context";
import {Button, Dropdown as Drop, Modal, Table} from "semantic-ui-react";
import {Form, Input, TextArea} from "semantic-ui-react-form-validator";
import Pagin from "../simpleEntity/Pagin";
import {Link} from "react-router-dom";

class Plan extends Component {
    state = {
        plans: [],
        name: "",
        startDate: null,
        approvedDate: null,
        endDate: null,
        note: "",

        totalPages: 1,
    };

    loadList = (params) => {
        axios
            .get(BACK_END_SERVER_URL + `/plans/page`, {params: params})
            .then((res) => {
                this.setState({
                    plans: res.data.content,
                    totalPages: res.data.totalPages,
                });
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
            });
    };

    add = () => {
        let url = this.state.id ? "/plans/" + this.state.id : "/plans";
        let method = this.state.id ? "put" : "post";
        axios({
            method: method,
            url: BACK_END_SERVER_URL + url,
            headers: {
                'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                "Content-type": "application/json",
            },
            data: {
                name: this.state.name,
                startDate: this.state.startDate,
                approvedDate: this.state.approvedDate,
                endDate: this.state.endDate,
                note: this.state.note,
                lecturer: {
                    id: getUserId(),
                }
            },
        })
            .then((res) => {
                if (this.state.id) {
                    this.state.plans.find((s) => s.id === this.state.id).name =
                        res.data.name;
                } else {
                    this.state.plans.push(res.data);
                }
                this.setState({
                    open: false,
                    name: "",
                    startDate: null,
                    approvedDate: null,
                    endDate: null,
                    note: "",
                });
            })
            .catch(({response}) => {
                this.setState({errorText: response.data.message});
            });
    };

    onUpdate = (plan) => {
        this.setState({
            id: plan.id,
            name: plan.name,
            startDate: plan.startDate,
            approvedDate: plan.approvedDate,
            endDate: plan.endDate,
            note: plan.note,
            open: true,
        });
    };

    onDownload = (id) => {
        axios({
            url: BACK_END_SERVER_URL + "/plans/" + id + "/download",
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.xlsx');
            document.body.appendChild(link);
            link.click();
        });
    };

    onRemove = (id) => {
        axios
            .delete(BACK_END_SERVER_URL + `/plans/${id}`, {
                headers: {
                    'Authorization': 'Bearer  ' + localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
                },
            })
            .then((res) => {
                this.setState({
                    id: null,
                    plans: this.state.plans.filter((s) => s.id !== id),
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
            <div className="plan">
                <div style={{alignSelf: "flex-end"}}>
                    <Modal
                        className="planModal"
                        onClose={() => this.setState({open: false})}
                        onOpen={() => this.setState({open: true, id: null})}
                        open={this.state.open}
                        trigger={<Button>Добавить план</Button>}
                    >
                        <Modal.Header>{getPopupTitle(this.state.id) + "план"}</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <Form ref="form" onSubmit={this.add}>
                                    <Input
                                        fluid
                                        name="name"
                                        label="Имя"
                                        placeholder="Имя"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                        validators={[
                                            "required",
                                            "minStringLength:9",
                                            "maxStringLength:10",
                                        ]}
                                        errorMessages={[
                                            "Данное поле является обязательным для заполнения",
                                            "Минимальная длинна 9 символов",
                                            "Максимальная длинна 10 символов",
                                        ]}
                                    />
                                    <div class="formGroupRow">
                                        <Input
                                            fluid
                                            name="startDate"
                                            label="Начало выполнения"
                                            placeholder="Начало выполнения"
                                            onChange={this.handleChange}
                                            value={this.state.startDate}
                                            type="date"
                                            validators={["required"]}
                                            errorMessages={[
                                                "Данное поле является обязательным для заполнения",
                                            ]}
                                        />
                                        <Input
                                            fluid
                                            name="endDate"
                                            label="Конец выполнения"
                                            placeholder="Конец выполнения"
                                            onChange={this.handleChange}
                                            value={this.state.endDate}
                                            type="date"
                                            validators={["required"]}
                                            errorMessages={[
                                                "Данное поле является обязательным для заполнения",
                                            ]}
                                        />
                                        <Input
                                            fluid
                                            name="approvedDate"
                                            label="Дата подписания"
                                            placeholder="Дата подписания"
                                            onChange={this.handleChange}
                                            value={this.state.approvedDate}
                                            type="date"
                                            validators={["required"]}
                                            errorMessages={[
                                                "Данное поле является обязательным для заполнения",
                                            ]}
                                        />
                                    </div>
                                    <TextArea
                                        name="note"
                                        label="Примечание"
                                        placeholder="Примечание"
                                    />
                                    <div className="ui divider"></div>
                                    <div className="buttons">
                                        <Button
                                            content={this.state.id ? "Редактировать" : "Сохранить"}
                                        />
                                        <Button
                                            content="Отменить"
                                            onClick={() => this.setState({
                                                open: false,
                                                name: "",
                                                startDate: null,
                                                approvedDate: null,
                                                endDate: null,
                                                note: "",
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
                            <Table.HeaderCell>Название</Table.HeaderCell>
                            <Table.HeaderCell>Начало выполнения</Table.HeaderCell>
                            <Table.HeaderCell>Конец выполнения</Table.HeaderCell>
                            <Table.HeaderCell>Дата подписания</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.values(this.state.plans).map((plan) => {
                            return (
                                <Table.Row key={plan.id}>
                                    <Table.Cell style={{width: 7}}>
                                        <Drop icon="ellipsis horizontal">
                                            <Drop.Menu>
                                                <Drop.Item text="Редактировать"
                                                           onClick={() => this.onUpdate(plan)}/>
                                                <Drop.Item text="Удалить"
                                                           onClick={() => this.onRemove(plan.id)}/>
                                                <Drop.Item text="Cкачать"
                                                           onClick={() => this.onDownload(plan.id)}/>
                                                <Drop.Item text="Учебный план" as={Link} to={{pathname: "/education-plan", search:"?planId=" + plan.id}}/>
                                            </Drop.Menu>
                                        </Drop>
                                    </Table.Cell>
                                    <Table.Cell>{plan.name}</Table.Cell>
                                    <Table.Cell>{plan.startDate}</Table.Cell>
                                    <Table.Cell>{plan.endDate}</Table.Cell>
                                    <Table.Cell>{plan.approvedDate}</Table.Cell>
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

export default Plan;
