import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Menu} from "semantic-ui-react";
import {isHasRole, ROLE_ADMIN, ROLE_LECTURER} from "../../context";
import logo from "../../logo_bntu_2018.svg"

const SUBJECTS = "subjects";
const SPECIALITIES = "specialities";
const FACULTIES = "faculties";
const DEPARTMENTS = "departments";
const RANKS = "ranks";
const DEGREES = "degrees";
const LECTURERS = "lecturers";
const GROUPS = "groups";
const STREAMS = "streams";
const WORKLOADS = "workloads";
const SIGN_OUT = "signOut";

const links = new Map([
    [
        SUBJECTS,
        {
            name: "subjects",
            url: "/subjects",
            value: "Subjects",
        },
    ],
    [
        SPECIALITIES,
        {
            name: "specialities",
            url: "/specialities",
            value: "Specialities",
        },
    ],
    [
        FACULTIES,
        {
            name: "faculties",
            url: "/faculties",
            value: "Faculties",
        },
    ],
    [
        DEPARTMENTS,
        {
            name: "departments",
            url: "/departments",
            value: "Departments",
        },
    ],
    [
        RANKS,
        {
            name: "ranks",
            url: "/ranks",
            value: "Ranks",
        },
    ],
    [
        DEGREES,
        {
            name: "degrees",
            url: "/degrees",
            value: "Degrees",
        },
    ],
    [
        LECTURERS,
        {
            name: "lecturers",
            url: "/lecturers",
            value: "Lecturers",
        },
    ],
    [
        GROUPS,
        {
            name: "groups",
            url: "/groups",
            value: "Groups",
        },
    ],
    [
        STREAMS,
        {
            name: "streams",
            url: "/streams",
            value: "Streams",
        },
    ],
    [
        WORKLOADS,
        {
            name: "workloads",
            url: "/workloads",
            value: "Workloads",
        },
    ],
    [
        SIGN_OUT,
        {
            name: "signOut",
            url: "/signOut",
            value: "SignOut",
        },
    ],
]);

class Header extends Component {
    state = {
        activeItem: "home",
        url: "/",
    };

    componentWillMount() {
        let url = window.location.pathname;
        Array.from(links.values()).forEach((value) => {
            if (value.name !== SUBJECTS && url.includes(value.url))
                this.setState({activeItem: value.name});
        });
    }

    handleItemClick = (e, {name}) => {
        this.setState({activeItem: name});
    };

    render() {
        return (
            <div>
                <Menu Stackable secondary>
                    <Menu.Item>
                        <img src={logo} style={{width:"90px",padding:"2px"}}/>
                    </Menu.Item>
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(SUBJECTS).name}
                            active={this.state.activeItem === links.get(SUBJECTS).name}
                            as={Link}
                            to={links.get(SUBJECTS).url}
                            onClick={this.handleItemClick}
                        >
                            Предметы
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(SPECIALITIES).name}
                            active={
                                this.state.activeItem === links.get(SPECIALITIES).name
                            }
                            as={Link}
                            to={links.get(SPECIALITIES).url}
                            onClick={this.handleItemClick}
                        >
                            Специальности
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(FACULTIES).name}
                            active={this.state.activeItem === links.get(FACULTIES).name}
                            as={Link}
                            to={links.get(FACULTIES).url}
                            onClick={this.handleItemClick}
                        >
                            Факультеты
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(DEPARTMENTS).name}
                            active={this.state.activeItem === links.get(DEPARTMENTS).name}
                            as={Link}
                            to={links.get(DEPARTMENTS).url}
                            onClick={this.handleItemClick}
                        >
                            Кафедры
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(RANKS).name}
                            active={this.state.activeItem === links.get(RANKS).name}
                            as={Link}
                            to={links.get(RANKS).url}
                            onClick={this.handleItemClick}
                        >
                            Ученое звание
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(DEGREES).name}
                            active={this.state.activeItem === links.get(DEGREES).name}
                            as={Link}
                            to={links.get(DEGREES).url}
                            onClick={this.handleItemClick}
                        >
                            Ученая степень
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(LECTURERS).name}
                            active={this.state.activeItem === links.get(LECTURERS).name}
                            as={Link}
                            to={links.get(LECTURERS).url}
                            onClick={this.handleItemClick}
                        >
                            Преподаватели
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(GROUPS).name}
                            active={this.state.activeItem === links.get(GROUPS).name}
                            as={Link}
                            to={links.get(GROUPS).url}
                            onClick={this.handleItemClick}
                        >
                            Группы
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) ? (
                        <Menu.Item
                            name={links.get(STREAMS).name}
                            active={this.state.activeItem === links.get(STREAMS).name}
                            as={Link}
                            to={links.get(STREAMS).url}
                            onClick={this.handleItemClick}
                        >
                            Потоки
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_LECTURER) ? (
                        <Menu.Item
                            name={links.get(WORKLOADS).name}
                            active={this.state.activeItem === links.get(WORKLOADS).name}
                            as={Link}
                            to={links.get(WORKLOADS).url}
                            onClick={this.handleItemClick}
                        >
                            Нагрузка
                        </Menu.Item>
                    ) : false}
                    {isHasRole(ROLE_ADMIN) || isHasRole(ROLE_LECTURER) ? (
                        <Menu.Menu position='right'>
                            <Menu.Item
                                name={links.get(SIGN_OUT).name}
                                active={this.state.activeItem === links.get(SIGN_OUT).name}
                                as={Link}
                                to={links.get(SIGN_OUT).url}
                                onClick={this.handleItemClick}
                            >
                                Выйти
                            </Menu.Item>
                        </Menu.Menu>
                    ) : false}
                </Menu>
            </div>
        );
    }
}

export default Header;
