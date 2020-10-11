import React, {Component} from 'react';
import axios from "axios/index";
import {BACK_END_SERVER_URL, LOCAL_STORAGE_OAUTH2_ACCESS_TOKEN} from "../../context";
import {Table, Modal, Button, Form, Icon} from "semantic-ui-react";
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class AcademicRank extends Component {

    render() {
        return (
            <SimpleCRUD
                url='academicRank'
                buttonName='Добавить Ранг'
            />
        );
    }
}

export default AcademicRank
