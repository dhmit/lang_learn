import React, { useState } from 'react';
// import ReactTooltipDefaultExport from 'react-tooltip';
// import * as PropTypes from 'prop-types';
import './quizView.scss';
import {
    ToggleButton,
    ToggleButtonGroup,
    Button,
} from 'react-bootstrap';
// import { Navbar, Footer } from '../UILibrary/components';

function ButtonChoices() {
    return (<>
        <ToggleButtonGroup className="text-center" type="radio" name="options">
            <ToggleButton variant="outline-light" value={1}>Choice 1</ToggleButton>
            <ToggleButton variant="outline-light" value={2}>Choice 2</ToggleButton>
            <ToggleButton variant="outline-light" value={3}>Choice 3</ToggleButton>
            <ToggleButton variant="outline-light" value={4}>Choice 4</ToggleButton>
        </ToggleButtonGroup>
    </>);
}

export class QuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        try {
            const response = await fetch('/api/get_quiz_data/');
            const data = await response.json();
            this.setState({ data });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* <Navbar /> */}
                <div className="page">
                    <div className="row" id="top">
                        <div className="col">
                            <h1>Verb Conjugation Quiz</h1>
                            <p><i>by Takako Aikawa</i></p>
                        </div>
                        <div className="col text-right">
                            <Button id="submit">Submit</Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            {/* list of questions for this quiz */}
                        </div>
                        <div className="col-7 shaded-box">
                            <h3>Question</h3>
                            <p>Select the correct conjugation for </p>
                            {/* insert word */}
                            {/* sentence with blank */}
                            <ButtonChoices />
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </React.Fragment>);
    }
}

export default QuizView;
