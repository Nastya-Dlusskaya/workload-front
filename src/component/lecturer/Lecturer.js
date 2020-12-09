import React, { Component } from "react";
import axios from "axios/index";
import {
  BACK_END_SERVER_URL,
  getPopupTitle,
  LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
} from "../../context";
import { Button, Dropdown as Drop, Modal, Table } from "semantic-ui-react";
import { Dropdown, Form, Input } from "semantic-ui-react-form-validator";
import Pagin from "../simpleEntity/Pagin";
import RadioButtons from "./RadioButtons";

class Lecturer extends Component {
  state = {
    lecturers: [],
    degrees: [],
    ranks: [],
    positions: [],
    lecturerSurname: "",
    lecturerName: "",
    lecturerPatronymic: "",
    lecturerEmail: "",
    lecturerSkype: "",
    lecturerMobilePhone: "",
    lecturerHomePhone: "",
    lecturerWorkPhone: "",
    lecturerStaff: false,
    lecturerBudget: false,
    lecturerHourPaid: false,
    rankId: null,
    degreeId: null,
    positionId: null,
    id: null,
    open: false,

    totalPages: 1,
  };

  loadList = (params) => {
    axios
      .get(BACK_END_SERVER_URL + `/lecturers/page`, { params: params })
      .then((res) => {
        this.setState({
          lecturers: res.data.content,
          totalPages: res.data.totalPages,
        });
      })
      .catch(({ response }) => {
        if (response) this.setState({ errorText: response.data.message });
      });
  };

  componentDidMount() {
    this.loadDegrees();
    this.loadRanks();
    this.loadPositions();
  }

  loadDegrees = () => {
    axios
      .get(BACK_END_SERVER_URL + `/academicDegree`)
      .then((res) => {
        let array = [];
        res.data.map((f) =>
          array.push({ key: f.id, text: f.name, value: f.id })
        );
        this.setState({ degrees: array });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  loadRanks = () => {
    axios
      .get(BACK_END_SERVER_URL + `/academicRank`)
      .then((res) => {
        let array = [];
        res.data.map((f) =>
          array.push({ key: f.id, text: f.name, value: f.id })
        );
        this.setState({ ranks: array });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  loadPositions = () => {
    axios
      .get(BACK_END_SERVER_URL + `/positions`)
      .then((res) => {
        let array = [];
        res.data.map((f) =>
          array.push({ key: f.id, text: f.name, value: f.id })
        );
        this.setState({ positions: array });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  add = () => {
    console.log(this.state.lecturerStaff);
    let url = this.state.id ? "/lecturers/" + this.state.id : "/lecturers";
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
        surname: this.state.lecturerSurname,
        name: this.state.lecturerName,
        patronymic: this.state.lecturerPatronymic,
        email: this.state.lecturerEmail,
        skype: this.state.lecturerSkype,
        mobilePhone: this.state.lecturerMobilePhone,
        homePhone: this.state.lecturerHomePhone,
        workPhone: this.state.lecturerWorkPhone,
        staff: this.state.lecturerStaff,
        budget: this.state.lecturerBudget,
        hourPaid: this.state.lecturerHourPaid,
        academicDegree: {
          id: this.state.degreeId,
        },
        academicRank: {
          id: this.state.rankId,
        },
        position: {
          id: this.state.positionId,
        },
      },
    })
      .then((res) => {
        if (this.state.id) {
          this.state.lecturers.find((s) => s.id === this.state.id).surname =
            res.data.surname;
        } else {
          this.state.lecturers.push(res.data);
        }
        this.setState({
          open: false,
          lecturerName: "",
          lecturerSurname: "",
          lecturerPatronymic: "",
          lecturerEmail: "",
          lecturerSkype: "",
          lecturerHomePhone: "",
          lecturerWorkPhone: "",
          lecturerMobilePhone: "",
          lecturerStaff: false,
          lecturerBudget: false,
          lecturerHourPaid: "",
          degreeId: null,
          rankId: null,
          positionId: null,
        });
      })
      .catch(({ response }) => {
        this.setState({ errorText: response.data.message });
      });
  };

  onUpdate = (lecturer) => {
    this.setState({
      id: lecturer.id,
      lecturerSurname: lecturer.surname,
      lecturerName: lecturer.name,
      lecturerPatronymic: lecturer.patronymic,
      lecturerEmail: lecturer.email,
      degreeId: lecturer.academicDegree.id,
      rankId: lecturer.academicRank.id,
      open: true,
    });
  };

  onRemove = (id) => {
    axios
      .delete(BACK_END_SERVER_URL + `/lecturers/${id}`, {
        headers: {
          Authorization:
            "Bearer  " +
            localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
        },
      })
      .then((res) => {
        this.setState({
          id: null,
          lecturers: this.state.lecturers.filter((s) => s.id !== id),
        });
      })
      .catch(({ response }) => {
        this.setState({ removeErrorText: response.data.message });
      });
  };

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  render() {
    return (
      <div className="lecturer">
        <div style={{ alignSelf: "flex-end" }}>
          <Modal
            className="lecturerModal"
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true, id: null })}
            open={this.state.open}
            trigger={<Button>Добавить преподавателя</Button>}
          >
            <Modal.Header>
              {getPopupTitle(this.state.id) + " преподавателя"}
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form ref="form" onSubmit={this.add}>
                  <div class="formGroupRow">
                    <Input
                      fluid
                      name="lecturerSurname"
                      label="Фамилия"
                      placeholder="Фамилия"
                      onChange={this.handleChange}
                      value={this.state.lecturerSurname}
                      validators={[
                        "required",
                        "minStringLength:2",
                        "maxStringLength:60",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 2 символа",
                        "Максимальная длинна 60 символов",
                      ]}
                    />
                    <Input
                      fluid
                      label="Имя"
                      placeholder="Имя"
                      onChange={this.handleChange}
                      value={this.state.lecturerName}
                      validators={[
                        "required",
                        "minStringLength:2",
                        "maxStringLength:60",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 2 символа",
                        "Максимальная длинна 60 символов",
                      ]}
                    />
                    <Input
                      fluid
                      name="lecturerPatronymic"
                      label="Отчество"
                      placeholder="Отчество"
                      onChange={this.handleChange}
                      value={this.state.lecturerPatronymic}
                      validators={[
                        "required",
                        "minStringLength:2",
                        "maxStringLength:60",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 2 символа",
                        "Максимальная длинна 60 символов",
                      ]}
                    />
                  </div>
                  <div class="formGroupRow">
                    <Dropdown
                      fluid
                      search
                      selection
                      name="rankId"
                      label="Ученое звание"
                      options={this.state.ranks}
                      defaultValue={this.state.rankId}
                      onChange={this.handleChange}
                      placeholder="Ученое звание"
                    />
                    <Dropdown
                      fluid
                      search
                      selection
                      name="rankId"
                      label="Ученая степень"
                      options={this.state.ranks}
                      defaultValue={this.state.rankId}
                      onChange={this.handleChange}
                      placeholder="Ученая степень"
                    />
                    <Dropdown
                      fluid
                      search
                      selection
                      name="positionId"
                      label="Должность"
                      options={this.state.positions}
                      defaultValue={this.state.positionId}
                      onChange={this.handleChange}
                      placeholder="Должность"
                      validators={["required"]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                      ]}
                    />
                  </div>
                  <div class="formGroupRow">
                    <Input
                      fluid
                      name="lecturerEmail"
                      label="Email"
                      placeholder="Email"
                      onChange={this.handleChange}
                      value={this.state.lecturerEmail}
                      validators={[
                        "required",
                        "minStringLength:2",
                        "maxStringLength:60",
                        "isEmail",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 2 символа",
                        "Максимальная длинна 60 символов",
                        "Это не почта",
                      ]}
                    />
                    <Input
                      fluid
                      name="lecturerSkype"
                      label="Skype"
                      placeholder="Skype"
                      onChange={this.handleChange}
                      value={this.state.lecturerSkype}
                      validators={[
                        "required",
                        "minStringLength:2",
                        "maxStringLength:60",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 2 символа",
                        "Максимальная длинна 60 символов",
                      ]}
                    />
                  </div>
                  <div class="formGroupRow">
                    <Input
                      fluid
                      name="lecturerMobilePhone"
                      label="Мобильный телефон"
                      placeholder="Мобильный телефон"
                      onChange={this.handleChange}
                      value={this.state.lecturerMobilePhone}
                      validators={[
                        "required",
                        "minStringLength:13",
                        "maxStringLength:14",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 13 символа",
                        "Максимальная длинна 14 символов",
                      ]}
                    />
                    <Input
                      fluid
                      name="lecturerHomePhone"
                      label="Домашний телефон"
                      placeholder="Домашний телефон"
                      onChange={this.handleChange}
                      value={this.state.lecturerHomePhone}
                      validators={[
                        "required",
                        "minStringLength:13",
                        "maxStringLength:14",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 13 символа",
                        "Максимальная длинна 14 символов",
                      ]}
                    />
                    <Input
                      fluid
                      name="lecturerWorkPhone"
                      label="Рабочий телефон"
                      placeholder="Рабочий телефон"
                      onChange={this.handleChange}
                      value={this.state.lecturerWorkPhone}
                      validators={[
                        "required",
                        "minStringLength:13",
                        "maxStringLength:14",
                      ]}
                      errorMessages={[
                        "Данное поле является обязательным для заполнения",
                        "Минимальная длинна 13 символа",
                        "Максимальная длинна 14 символов",
                      ]}
                    />
                  </div>
                  <div class="formGroupRow">
                    <RadioButtons
                      setValue={(result) => (this.state.lecturerStaff = result)}
                      list={[
                        {
                          name: "lecturerStaff",
                          label: "Штатный",
                          value: "true",
                        },
                        {
                          name: "lecturerStaff",
                          label: "Совместитель",
                          value: "false",
                          def: true,
                        },
                      ]}
                    />
                    <RadioButtons
                      setValue={(result) =>
                        (this.state.lecturerBudget = result)
                      }
                      list={[
                        {
                          name: "lecturerBudget",
                          label: "Бюджет",
                          value: "true",
                        },
                        {
                          name: "lecturerBudget",
                          label: "Не бюджет",
                          value: "false",
                          def: true,
                        },
                      ]}
                    />
                    <RadioButtons
                      setValue={(result) => (this.state.lecturerStaff = result)}
                      list={[
                        {
                          name: "lecturerHourPaid",
                          label: "Почасовик",
                          value: "true",
                        },
                        {
                          name: "lecturerHourPaid",
                          label: "Ставка",
                          value: "false",
                          def: true,
                        },
                      ]}
                    />
                  </div>
                  <div className="ui divider"></div>
                  <div className="buttons">
                    <Button
                      content={this.state.id ? "Обновить" : "Сохранить"}
                    />
                    <Button
                      content="Отменить"
                      onClick={() => this.setState({ open: false })}
                      secondary
                    />
                  </div>
                </Form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </div>

        <Table celled style={{ alignSelf: "center" }}>
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Фамилия</Table.HeaderCell>
              <Table.HeaderCell>Имя</Table.HeaderCell>
              <Table.HeaderCell>Отчество</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Телефон</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.values(this.state.lecturers).map((lecturer) => {
              return (
                <Table.Row key={lecturer.id}>
                  <Table.Cell style={{ width: 7 }}>
                    <Drop icon="ellipsis horizontal">
                      <Drop.Menu>
                        <Drop.Item
                          text="Редактировать"
                          onClick={() => this.onUpdate(lecturer)}
                        />
                        <Drop.Item
                          text="Удалить"
                          onClick={() => this.onRemove(lecturer.id)}
                        />
                      </Drop.Menu>
                    </Drop>
                  </Table.Cell>
                  <Table.Cell>{lecturer.surname}</Table.Cell>
                  <Table.Cell>{lecturer.name}</Table.Cell>
                  <Table.Cell>{lecturer.patronymic}</Table.Cell>
                  <Table.Cell>{lecturer.email}</Table.Cell>
                  <Table.Cell>{lecturer.mobilePhone}</Table.Cell>
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

export default Lecturer;
