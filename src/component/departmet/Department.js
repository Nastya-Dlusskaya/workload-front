import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL, getPopupTitle, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,} from "../../context";
import {Button, Dropdown as Drop, Modal, Table} from "semantic-ui-react";
import {Dropdown, Form, Input} from "semantic-ui-react-form-validator";
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
      .get(BACK_END_SERVER_URL + `/departments/page`, { params: params })
      .then((res) => {
        this.setState({
          departments: res.data.content,
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
      .get(BACK_END_SERVER_URL + `/faculties`)
      .then((res) => {
        let array = [];
        res.data.map((f) =>
          array.push({ key: f.id, text: f.name, value: f.id })
        );
        this.setState({ faculties: array });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  add = () => {
    let url = this.state.id ? "/departments/" + this.state.id : "/departments";
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
      .delete(BACK_END_SERVER_URL + `/departments/${id}`, {
        headers: {
          Authorization:
            "Bearer  " +
            localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
        },
      })
      .then(() => {
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
      <div class="department">
        <div style={{ alignSelf: "flex-end" }}>
          <Modal
            className="departmentModal"
            size={"small"}
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true, id: null })}
            open={this.state.open}
            trigger={<Button>Добавить кафедру</Button>}
          >
            <Modal.Header>
              {getPopupTitle(this.state.id) + " факультет"}
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form ref="form" onSubmit={this.add}>
                  <Input
                    fluid
                    name="departmentName"
                    label="Название"
                    placeholder="Название"
                    onChange={this.handleChange}
                    value={this.state.departmentName}
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
                  <Dropdown
                    fluid
                    search
                    selection
                    name="facultyId"
                    label="Факультет"
                    options={this.state.faculties}
                    defaultValue={this.state.facultyId}
                    onChange={this.handleChange}
                    placeholder="Факультет"
                    validators={["required"]}
                    errorMessages={[
                      "Данное поле является обязательным для заполнения",
                    ]}
                  />
                  <div className="ui divider"></div>
                  <div className="buttons">
                    <Button
                      content={this.state.id ? "Редактировать" : "Сохранить"}
                    />
                    <Button
                      content="Отменить"
                      onClick={() => this.setState({ open: false,
                        facultyId: null,
                        departmentName: "",})}
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
              <Table.HeaderCell>Название</Table.HeaderCell>
              <Table.HeaderCell>Факультет</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.values(this.state.departments).map((dep) => {
              return (
                <Table.Row key={dep.id}>
                  <Table.Cell style={{ width: 7 }}>
                    <Drop icon="ellipsis horizontal">
                      <Drop.Menu>
                        <Drop.Item
                          text="Редактировать"
                          onClick={() => this.onUpdate(dep)}
                        />
                        <Drop.Item
                          text="Удалить"
                          onClick={() => this.onRemove(dep.id)}
                        />
                      </Drop.Menu>
                    </Drop>
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
