import React, {Component} from "react";
import {Form, Radio} from "semantic-ui-react";

class RadioButtons extends Component {
    state = {
    }
    handleChange = (e, {value}) => {
        this.setState({value});
        this.props.setValue(value)
    }

    componentDidMount(){
        this.setState({value:this.props.list.filter(i => i.def === true).value});
    }

    render() {
        return (
            <Form.Group grouped>
                {this.props.list?.map((item) => {
                    return (<Form.Field name={item.name} label={item.label} control={Radio} value={item.value}
                                        checked={this.state.value === item.value} onChange={this.handleChange}/>
                    );
                })}
            </Form.Group>
        );
    }

}

export default RadioButtons;