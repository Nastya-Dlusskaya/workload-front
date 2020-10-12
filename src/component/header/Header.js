import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Container, Menu} from "semantic-ui-react";
import {LOCAL_STORAGE_USER_DATA, ROLE_ADMIN} from "../../context";

const SUBJECTS = 'subjects';
const SPECIALITIES = 'specialities';
const FACULTIES = 'faculties';
const DEPARTMENTS = 'departments';
const RANKS = 'ranks';
const DEGREES = 'degrees';
const LECTURERS = 'lecturers';

const links = new Map([
    [SUBJECTS, {
        name: 'subjects',
        url: '/subjects',
        value: 'Subjects',
    }],
    [SPECIALITIES, {
        name: 'specialities',
        url: '/specialities',
        value: 'Specialities',
    }],
    [FACULTIES, {
        name: 'faculties',
        url: '/faculties',
        value: 'Faculties',
    }],
    [DEPARTMENTS, {
        name: 'departments',
        url: '/departments',
        value: 'Departments',
    }],
    [RANKS, {
        name: 'ranks',
        url: '/ranks',
        value: 'Ranks',
    }],
    [DEGREES, {
        name: 'degrees',
        url: '/degrees',
        value: 'Degrees',
    }],
    [LECTURERS, {
        name: 'lecturers',
        url: '/lecturers',
        value: 'Lecturers',
    }],
]);

class Header extends Component {

    state = {
        activeItem: 'home',
        url: '/'
    };

    componentWillMount() {
        let url = window.location.pathname;
        Array.from(links.values()).forEach(value => {
            if (value.name !== SUBJECTS && url.includes(value.url))
                this.setState({activeItem: value.name});
        });
    }

    handleItemClick = (e, {name}) => {
        this.setState({activeItem: name});
    };

    isHasRole = (role) => {
        let user = localStorage.getItem(LOCAL_STORAGE_USER_DATA);
        if (user) {
            let roles = JSON.parse(user).authorities;
            if (roles && roles.includes(role)) {
                return true;
            }
        }
        return false;
    };

    render() {
        return (<div className='backgroundImage'>
                <Container>
                    <Menu secondary>
                        <Menu.Menu>
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(SUBJECTS).name}
                                active={this.state.activeItem === links.get(SUBJECTS).name}
                                as={Link}
                                to={links.get(SUBJECTS).url}
                                onClick={this.handleItemClick}>
                                Предметы
                            </Menu.Item>
                            : false}
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(SPECIALITIES).name}
                                active={this.state.activeItem === links.get(SPECIALITIES).name}
                                as={Link}
                                to={links.get(SPECIALITIES).url}
                                onClick={this.handleItemClick}>
                                Специальности
                            </Menu.Item>
                            : false}
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(FACULTIES).name}
                                active={this.state.activeItem === links.get(FACULTIES).name}
                                as={Link}
                                to={links.get(FACULTIES).url}
                                onClick={this.handleItemClick}>
                                Факультеты
                            </Menu.Item>
                            : false}
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(DEPARTMENTS).name}
                                active={this.state.activeItem === links.get(DEPARTMENTS).name}
                                as={Link}
                                to={links.get(DEPARTMENTS).url}
                                onClick={this.handleItemClick}>
                                Кафедры
                            </Menu.Item>
                            : false}
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(RANKS).name}
                                active={this.state.activeItem === links.get(RANKS).name}
                                as={Link}
                                to={links.get(RANKS).url}
                                onClick={this.handleItemClick}>
                                Ученое звание
                            </Menu.Item>
                            : false}
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(DEGREES).name}
                                active={this.state.activeItem === links.get(DEGREES).name}
                                as={Link}
                                to={links.get(DEGREES).url}
                                onClick={this.handleItemClick}>
                                Ученая степень
                            </Menu.Item>
                            : false}
                            {this.isHasRole(ROLE_ADMIN) ?
                            <Menu.Item
                                name={links.get(LECTURERS).name}
                                active={this.state.activeItem === links.get(LECTURERS).name}
                                as={Link}
                                to={links.get(LECTURERS).url}
                                onClick={this.handleItemClick}>
                                Преподаватели
                            </Menu.Item>
                            : false}
                            {/*{this.isHasRole(ROLE_JOURNALIST) || this.isHasRole(ROLE_LIBRARIAN)*/}
                            {/*|| this.isHasRole(ROLE_COURIER) || this.isHasRole(ROLE_OPERATOR)*/}
                            {/*|| this.isHasRole(ROLE_ADMIN) */}
                        </Menu.Menu>
                    </Menu>
                </Container>
            </div>
        );
    }
}

export default Header;