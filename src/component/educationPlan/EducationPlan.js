import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL,} from "../../context";
import {Dropdown, Table} from "semantic-ui-react";
import queryString from "query-string";

class EducationPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: props.location.id,
            rows: [],
            plans: [],
        }
    }

    componentWillMount() {
        if (this.props.location.search) {
            const params = queryString.parse(this.props.location?.search);
            this.setState({planId: params.planId}, this.loadList);
        }
        this.loadPlans();
    }

    loadList = () => {
        axios
            .get(BACK_END_SERVER_URL + "/plans/" + this.state.planId + "/education-plan")
            .then((res) => {
                this.setState({
                    rows: res.data,
                });
                console.log(Object.values(res.data));
            })
            .catch(({response}) => {
                if (response) this.setState({errorText: response.data.message});
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

    componentDidMount() {
        this.loadList();
        this.loadPlans()
    }

    handleChange = (event, {name, value}) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({[name]: value});
        }
    };

    render() {
        console.log(this.state);
        return (
            <div className="plan">
                <Dropdown
                    search
                    selection
                    name="planId"
                    label="План"
                    options={this.state.plans}
                    value={this.state.planId}
                    validators={["required"]}
                    errorMessages={[
                        "Данное поле является обязательным для заполнения",
                    ]}
                    onChange={this.handleChange}
                    placeholder="План"
                />
                <Table celled style={{alignSelf: "center"}}>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell rowSpan={2}>Предмет</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Лекции</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Практические</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Лаб</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Курсовые</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Консультации</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Зачеты</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Экзамены</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Аспиранты</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Диплом</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>ГЭК</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Практика</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Посещение</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2}>Рецензия</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.HeaderCell>Текущий</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.rows.map((row) => {
                                return (
                                    <Table.Row key={row.id}>
                                        <Table.Cell>{row.subjectName}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "LECTURE")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "LECTURE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "PRACTISE")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "PRACTISE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "LABORATORY")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "LABORATORY")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "COURSEWORK")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "COURSEWORK")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "CONSULTATION")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "CONSULTATION")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "SET_OFF")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "SET_OFF")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "EXAM")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "EXAM")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "POST_GRADUATE")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "POST_GRADUATE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "DIPLOMA")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "DIPLOMA")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "EXAM_COMMITTEE")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "EXAM_COMMITTEE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "FIELD_TRIP")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "FIELD_TRIP")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "ATTENDANCE")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "ATTENDANCE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "REVIEW")}</Table.Cell>
                                        <Table.Cell>{this.getActualValue(row, "REVIEW")}</Table.Cell>
                                    </Table.Row>
                                );
                            })}
                    </Table.Body>
                </Table>
            </div>
        );
    }

    getExpectedValue(row, value) {
        return row.items.find((s) => s.name === value)?.expected;
    }

    getActualValue(row, value) {
        return row.items.find((s) => s.name === value)?.actual;
    }
}

export default EducationPlan;
