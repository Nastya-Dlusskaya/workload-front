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
const NEWS = 'news';
const CATALOG = 'catalog';
const BASKET = 'basket';
const ADMIN = 'admin';

const links = new Map([
    [SUBJECTS, {
        name: 'subjects',
        url: '/subjects',
        value: 'Subjects',
    }],
    [CATALOG, {
        name: 'catalog',
        url: '/catalog',
        value: 'Catalog',
    }],
    [BASKET, {
        name: 'basket',
        url: '/basket',
        value: 'Basket',
    }],
    [ADMIN, {
        name: 'admin',
        url: '/admin',
        value: 'Admin',
    }],
]);


class Header extends Component {

    state = {
        activeItem: 'home',
        url: '/',
        countInBasket: 0,
    };

    componentWillMount() {
        let url = window.location.pathname;
        Array.from(links.values()).forEach(value => {
            if (value.name !== HOME && url.includes(value.url))
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
                                name={links.get(HOME).name}
                                active={this.state.activeItem === links.get(HOME).name}
                                as={Link}
                                to={links.get(HOME).url}
                                onClick={this.handleItemClick}>
                                Home
                            </Menu.Item>
                            <Menu.Item
                                name={links.get(NEWS).name}
                                active={this.state.activeItem === links.get(NEWS).name}
                                as={Link}
                                to={links.get(NEWS).url}
                                onClick={this.handleItemClick}>
                                News
                            </Menu.Item>
                            <Menu.Item
                                name={links.get(CATALOG).name}
                                active={this.state.activeItem === links.get(CATALOG).name}
                                as={Link}
                                to={links.get(CATALOG).url}
                                onClick={this.handleItemClick}>
                                Catalog
                            </Menu.Item>
                            <Menu.Item
                                name={links.get(BASKET).name}
                                active={this.state.activeItem === links.get(BASKET).name}
                                as={Link}
                                to={links.get(BASKET).url}
                                onClick={this.handleItemClick}>
                                Basket
                            </Menu.Item>
                            {this.isHasRole(ROLE_JOURNALIST) || this.isHasRole(ROLE_LIBRARIAN)
                            || this.isHasRole(ROLE_COURIER) || this.isHasRole(ROLE_OPERATOR)
                            || this.isHasRole(ROLE_ADMIN) ?
                                <Menu.Item
                                    name={links.get(ADMIN).name}
                                    active={this.state.activeItem === links.get(ADMIN).name}
                                    as={Link}
                                    to={links.get(ADMIN).url}
                                    onClick={this.handleItemClick}>
                                    'Admin'
                                </Menu.Item> : false}
                            <Menu.Menu position='right'>
                                <Menu.Item
                                    name={links.get(BASKET).name}
                                    active={this.state.activeItem === links.get(BASKET).name}
                                    as={Link}
                                    to={links.get(BASKET).url}
                                    onClick={this.handleItemClick}>
                                    Sign Out
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Menu>
                    </Menu>
                </Container>
            </div>
        );
    }
}

export default Header;