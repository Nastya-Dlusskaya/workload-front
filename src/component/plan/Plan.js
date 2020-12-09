import React, { Component } from "react";
import axios from "axios/index";
import {
  BACK_END_SERVER_URL,
  getPopupTitle,
  LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
} from "../../context";
import { Button, Modal } from "semantic-ui-react";
import { Form, Input } from "semantic-ui-react-form-validator";

class Plan extends Component {
  state = {
    plans: [],
    name: "",
    startDate: null,
    approvedDate: null,
    endDate: null,

    totalPages: 1,
  };

  loadList = (params) => {
    axios
      .get(BACK_END_SERVER_URL + `/plans/page`, { params: params })
      .then((res) => {
        this.setState({
          plans: res.data.content,
          totalPages: res.data.totalPages,
        });
      })
      .catch(({ response }) => {
        if (response) this.setState({ errorText: response.data.message });
      });
  };

  componentDidMount() {
    this.loadFaculties();
  }

  loadFaculties = () => {
    axios
      .get(BACK_END_SERVER_URL + `/plans`)
      .then((res) => {
        let array = [];
        res.data.map((f) =>
          array.push({ key: f.id, text: f.name, value: f.id })
        );
        this.setState({ plans: array });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  add = () => {
    let url = this.state.id ? "/plans/" + this.state.id : "/plans";
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
        name: this.state.name,
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
      .catch(({ response }) => {
        this.setState({ errorText: response.data.message });
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
      .delete(BACK_END_SERVER_URL + `/plans/${id}`, {
        headers: {
          Authorization:
            "Bearer  " +
            localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
        },
      })
      .then((res) => {
        this.setState({
          id: null,
          departments: this.state.departments.filter((s) => s.id !== id),
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
        <div style={{ alignSelf: "flex-end" }}>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true, id: null })}
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
                  <Button content={this.state.id ? "Обновить" : "Сохранить"} />
                  <Button
                    content="Отменить"
                    onClick={() => this.setState({ open: false })}
                    secondary
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

export default Plan;
