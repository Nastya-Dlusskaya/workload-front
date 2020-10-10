import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Container, Menu} from "semantic-ui-react";
import {
    LOCAL_STORAGE_BASKET,
    LOCAL_STORAGE_USER_DATA,
    ROLE_ADMIN,
    ROLE_COURIER,
    ROLE_JOURNALIST,
    ROLE_LIBRARIAN,
    ROLE_OPERATOR
} from "../../context";

const SUBJECTS = 'subjects';
const SPECIALITIES = 'specialities';
const FACULTIES = 'faculties';
const DEPARTMENTS = 'departments';

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
                            <Menu.Item
                                name={links.get(SUBJECTS).name}
                                active={this.state.activeItem === links.get(SUBJECTS).name}
                                as={Link}
                                to={links.get(SUBJECTS).url}
                                onClick={this.handleItemClick}>
                                Предметы
                            </Menu.Item>
                            <Menu.Item
                                name={links.get(SPECIALITIES).name}
                                active={this.state.activeItem === links.get(SPECIALITIES).name}
                                as={Link}
                                to={links.get(SPECIALITIES).url}
                                onClick={this.handleItemClick}>
                                Специальности
                            </Menu.Item>
                            <Menu.Item
                                name={links.get(FACULTIES).name}
                                active={this.state.activeItem === links.get(FACULTIES).name}
                                as={Link}
                                to={links.get(FACULTIES).url}
                                onClick={this.handleItemClick}>
                                Факультеты
                            </Menu.Item>
                            <Menu.Item
                                name={links.get(DEPARTMENTS).name}
                                active={this.state.activeItem === links.get(DEPARTMENTS).name}
                                as={Link}
                                to={links.get(DEPARTMENTS).url}
                                onClick={this.handleItemClick}>
                                Кафедры
                            </Menu.Item>
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