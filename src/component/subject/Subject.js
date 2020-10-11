import React, {Component} from 'react';
import SimpleCRUD from "../simpleEntity/SimpleCRUD";

class Subject extends Component {

    render() {
        return (
            <SimpleCRUD
                url='subjects'
                buttonName='Добавить Предмет'
            />
        );
    }
}

export default Subject
