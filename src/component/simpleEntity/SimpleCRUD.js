import React, { Component } from "react";
import axios from "axios/index";
import queryString from "query-string/index";
import {
  BACK_END_SERVER_URL,
  LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN,
} from "../../context";
import {
  Button,
  Dropdown,
  Icon,
  Modal,
  Pagination,
  Table,
} from "semantic-ui-react";

import { Form, Input } from "semantic-ui-react-form-validator";

const START_SIZE = 10;

class SimpleCRUD extends Component {
  static defaultProps = {
    buttonName: "Добавить",
  };
  state = {
    list: [],
    name: "",
    id: null,
    open: false,

    sizeList: [],

    page: 1,
    size: START_SIZE,
    sort: ["name,DESC"],
    totalPages: 1,
  };

  componentWillMount() {
    this.loadSizeList();
    if (this.props.location.search) {
      const params = queryString.parse(this.props.location?.search);
      this.setState(
        {
          page: params.page || this.state.page,
          size: params.size || this.state.size,
          sort: !params.sort
            ? this.state.sort
            : Array.isArray(params.sort)
            ? params.sort
            : Array.of(params.sort),
        },
        () => {
          this.loadList();
        }
      );
    } else {
      this.loadList();
    }
  }

  changeUrl = () => {
    console.log(this.state);
    const params = {
      page: this.state.page,
      size: this.state.size,
      sort: this.state.sort,
    };
    this.props.history.push({ search: queryString.stringify(params) });
    console.log(this.state);
  };

  loadList = () => {
    let params = new URLSearchParams();
    params.append("page", (this.state.page - 1).toString());
    params.append("size", this.state.size.toString());
    this.state.sort.forEach((i) => params.append("sort", i));
    axios
      .get(BACK_END_SERVER_URL + `/${this.props.url}/page`, { params: params })
      .then((res) => {
        this.setState(
          {
            list: res.data.content,
            page: res.data.number + 1,
            totalPages: res.data.totalPages,
            size: res.data.size,
          },
          this.changeUrl
        );
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
          open: false,
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
      open: true,
    });
  };

  onRemove = (id) => {
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
        });
      })
      .catch(({ response }) => {
        this.setState({ removeErrorText: response.data.message });
      });
  };

  handleChangeName = (event, { value }) => {
    this.setState({ name: value });
  };

  handleChangeSize = (event, { value }) => {
    this.setState({ size: value, page: 1 }, this.loadList);
  };

  handlePaginationChange = (event, { activePage }) => {
    this.setState({ page: activePage }, this.loadList);
  };

  loadSizeList = () => {
    let min = START_SIZE;
    let attay = [];
    for (let i = 0; i < 4; i++) {
      let value = i * START_SIZE + min;
      attay.push({ key: value, text: value, value: value });
    }
    return attay;
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
          margin: "50px auto",
        }}
      >
        <div style={{ alignSelf: "flex-end" }}>
          <Modal
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true, id: null })}
            open={this.state.open}
            trigger={<Button>{this.props.buttonName}</Button>}
          >
            <Modal.Content>
              <Modal.Description>
                <Form ref="form" onSubmit={this.add}>
                  <Modal.Header>{this.props.buttonName}</Modal.Header>
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
                  <Button
                    content="Отменить"
                    color="black"
                    onClick={() => this.setState({ open: false })}
                  />
                  <Button
                    content={this.state.id ? "Обновить" : "Сохранить"}
                    labelPosition="right"
                    icon="checkmark"
                    positive
                  />
                </Form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </div>

        <Table celled style={{ alignSelf: "center" }}>
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Название</Table.HeaderCell>
              <Table.HeaderCell>Обновить</Table.HeaderCell>
              <Table.HeaderCell>Удалить</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.list?.map((item) => {
              return (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell
                    icon={<Icon name="edit" />}
                    onClick={() => this.onUpdate(item)}
                  />
                  <Table.Cell
                    icon={<Icon name="remove" />}
                    onClick={() => this.onRemove(item.id)}
                  />
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <div style={{ alignSelf: "flex-end" }}>
          <Pagination
            activePage={this.state.page}
            onPageChange={this.handlePaginationChange}
            boundaryRange={2}
            size="small"
            siblingRange={1}
            totalPages={this.state.totalPages || 1}
            firstItem={{
              content: <Icon name="angle double left" />,
              icon: true,
            }}
            lastItem={{
              content: <Icon name="angle double right" />,
              icon: true,
            }}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
          />
          <Dropdown
            onChange={this.handleChangeSize}
            options={this.loadSizeList()}
            placeholder="size"
            selection
            value={this.state.size}
          />
        </div>
      </div>
    );
  }
}

export default SimpleCRUD;
