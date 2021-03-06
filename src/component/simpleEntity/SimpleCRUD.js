import React, {Component} from "react";
import axios from "axios/index";
import {BACK_END_SERVER_URL, getPopupTitle, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,} from "../../context";
import {Button, Confirm, Dropdown, Modal, Table} from "semantic-ui-react";

import {Form, Input} from "semantic-ui-react-form-validator";
import Pagin from "./Pagin";

class SimpleCRUD extends Component {
  static defaultProps = {
    buttonName: "Добавить",
  };
  state = {
    list: [],
    name: "",
    id: null,
    openAddUpdate: false,
    openDelete: false,

    sizeList: [],

    totalPages: 1,
  };

  loadList = (params) => {
    axios
      .get(BACK_END_SERVER_URL + `/${this.props.url}/page`, { params: params })
      .then((res) => {
        this.setState({
          list: res.data.content,
          totalPages: res.data.totalPages,
        });
      })
      .catch(({ response }) => {
        if (response) this.setState({ errorText: response.data.message });
      });
  };

  add = () => {
    let url = this.state.id
      ? `/${this.props.url}/${this.state.id}`
      : `/${this.props.url}`;
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
      },
    })
      .then((res) => {
        if (this.state.id) {
          this.state.list.find((s) => s.id === this.state.id).name =
            res.data.name;
        } else {
          this.state.list.push(res.data);
        }
        this.setState({
          openAddUpdate: false,
          id: null,
          name: "",
        });
      })
      .catch(({ response }) => {
        this.setState({ errorText: response.data.message });
      });
  };

  onUpdate = (degree) => {
    this.setState({
      id: degree.id,
      name: degree.name,
      openAddUpdate: true,
    });
  };

  onConfirmDelete = (id) => {
    this.setState({
      id: id,
      openDelete: true,
    });
  };

  onConfirmDeleteCancel = () => {
    this.setState({
      openDelete: false,
    });
  };

  onRemove = () => {
    let id = this.state.id;
    axios
      .delete(BACK_END_SERVER_URL + `/${this.props.url}/${id}`, {
        headers: {
          Authorization:
            "Bearer  " +
            localStorage.getItem(LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN),
        },
      })
      .then((res) => {
        this.setState({
          id: null,
          name: "",
          list: this.state.list.filter((s) => s.id !== id),
          openDelete: false,
        });
      })
      .catch(({ response }) => {
        this.setState({ removeErrorText: response.data.message });
      });
  };

  handleChangeName = (event, { value }) => {
    this.setState({ name: value });
  };

  render() {
    return (
      <div class="simpleCrud">
        <div style={{ alignSelf: "flex-end" }}>
          <Modal
            className={"simpleCrudModal"}
            size={"tiny"}
            onClose={() => this.setState({ openAddUpdate: false })}
            onOpen={() => this.setState({ openAddUpdate: true, id: null })}
            open={this.state.openAddUpdate}
            trigger={<Button>{"Добавить " + this.props.buttonName}</Button>}
          >
            <Modal.Header>
              {getPopupTitle(this.state.id) + this.props.buttonName}
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form ref="form" onSubmit={this.add}>
                  <Input
                    type="text"
                    label="Название"
                    placeholder="Название"
                    onChange={this.handleChangeName}
                    value={this.state.name}
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
                  <div className="ui divider"></div>
                  <div class="buttons">
                    <Button
                      content={this.state.id ? "Редактировать" : "Сохранить"}
                    />
                    <Button
                      content="Отменить"
                      onClick={() => this.setState({ openAddUpdate: false,
                        name: "",
                        id: null,})}
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
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.list?.map((item) => {
              return (
                <Table.Row key={item.id}>
                  <Table.Cell style={{ width: 7 }}>
                    <Dropdown icon="ellipsis horizontal">
                      <Dropdown.Menu>
                        <Dropdown.Item
                          text="Редактировать"
                          onClick={() => this.onUpdate(item)}
                        />
                        <Dropdown.Item
                          text="Удалить"
                          onClick={() => this.onConfirmDelete(item.id)}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  </Table.Cell>
                  <Confirm
                    open={this.state.openDelete}
                    onCancel={() => this.onConfirmDeleteCancel()}
                    onConfirm={() => this.onRemove(item.id)}
                  />
                  <Table.Cell>{item.name}</Table.Cell>
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

export default SimpleCRUD;
