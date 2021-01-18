import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL,} from "../../context";
import {Message, Table} from "semantic-ui-react";
import queryString from "query-string";

const list = [
    'Строки с белым фоном - планируемая нагрузка',
    'Строки с зеленым фоном - выполненная нагрузка'
]

class EducationPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: props.location.id,
            rows: [],
            plans: [],
            visible: true,
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

    handleDismiss = () => {
        this.setState({ visible: false }, console.log(this.state.visible))
    }

    render() {
        return (
            <div className="education-plan">
                {
                    this.state.visible ? (<Message
                    onDismiss={this.handleDismiss}
                    header='Описание таблицы'
                    list={list}
                    /> ): false
                }

                <Table celled style={{alignSelf: "center"}}>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>Предмет</Table.HeaderCell>
                            <Table.HeaderCell>Лекции</Table.HeaderCell>
                            <Table.HeaderCell>Практические</Table.HeaderCell>
                            <Table.HeaderCell>Лаб</Table.HeaderCell>
                            <Table.HeaderCell>Курсовые</Table.HeaderCell>
                            <Table.HeaderCell>Консультации</Table.HeaderCell>
                            <Table.HeaderCell>Зачеты</Table.HeaderCell>
                            <Table.HeaderCell>Экзамены</Table.HeaderCell>
                            <Table.HeaderCell>Магистранты</Table.HeaderCell>
                            <Table.HeaderCell>Аспиранты</Table.HeaderCell>
                            <Table.HeaderCell>Диплом</Table.HeaderCell>
                            <Table.HeaderCell>Дипломная практика</Table.HeaderCell>
                            <Table.HeaderCell>ГЭК</Table.HeaderCell>
                            <Table.HeaderCell>Практика</Table.HeaderCell>
                            <Table.HeaderCell>Рецензия</Table.HeaderCell>
                            <Table.HeaderCell>Всего</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            this.state.rows.map((row) => {
                                return (
                                    <>
                                    <Table.Row key={row.id + "expected"}>
                                        <Table.Cell rowSpan={2}>{row.subjectName}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "LECTURE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "PRACTISE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "LABORATORY")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "COURSEWORK")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "CONSULTATION")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "SET_OFF")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "EXAM")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "POST_GRADUATE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "POST_GRADUATE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "DIPLOMA")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "DIPLOMA")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "EXAM_COMMITTEE")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "FIELD_TRIP")}</Table.Cell>
                                        <Table.Cell>{this.getExpectedValue(row, "REVIEW")}</Table.Cell>
                                        <Table.Cell>{this.getSumExpectedValue(row)}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell className="odd">{this.getActualValue(row, "LECTURE")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "PRACTISE")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "LABORATORY")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "COURSEWORK")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "CONSULTATION")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "SET_OFF")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "EXAM")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "POST_GRADUATE")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "POST_GRADUATE")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "DIPLOMA")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "DIPLOMA")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "EXAM_COMMITTEE")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "FIELD_TRIP")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getActualValue(row, "REVIEW")}</Table.Cell>
                                        <Table.Cell className="odd">{this.getSumActualValue(row)}</Table.Cell>
                                    </Table.Row>
                                    </>
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

    getSumExpectedValue(row) {
        return row.items.map(item => item.expected).reduce((prev, next) => prev + next)
    }

    getSumActualValue(row) {
        return row.items.map(item => item.actual).reduce((prev, next) => prev + next)
    }
}

export default EducationPlan;
