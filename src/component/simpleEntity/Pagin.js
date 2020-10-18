import React, { Component } from "react";
import queryString from "query-string/index";
import { Dropdown, Icon, Pagination } from "semantic-ui-react";

const START_SIZE = 10;

class Pagin extends Component {
  state = {
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
          size: Number.parseInt(params.size) || this.state.size,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.totalPages !== this.state.totalPages) {
      this.setState({ totalPages: nextProps.totalPages });
    }
  }

  loadList = () => {
    this.changeUrl();
    let params = new URLSearchParams();
    params.append("page", (this.state.page - 1).toString());
    params.append("size", this.state.size.toString());
    this.state.sort.forEach((i) => params.append("sort", i));
    this.props.loadList(params);
  };

  changeUrl = () => {
    const params = {
      page: this.state.page,
      size: this.state.size,
      sort: this.state.sort,
    };
    this.props.history.push({ search: queryString.stringify(params) });
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
    );
  }
}

export default Pagin;
