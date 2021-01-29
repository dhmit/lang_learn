import React from 'react';
import './quizView.scss';
// import ReactTooltipDefaultExport from 'react-tooltip';
import * as PropTypes from 'prop-types';
import {
    ToggleButton,
    ToggleButtonGroup,
    Button,
} from 'react-bootstrap';
// import { Navbar, Footer } from '../UILibrary/components';

function ButtonChoices(props) {
    const { choices } = props;

    const radios = choices.map((choice, i) => {
        return (
            <ToggleButton key={i + 1} variant="outline-light" value={i + 1}>{choice}</ToggleButton>
        );
    });

    return (<>
        <ToggleButtonGroup className="text-center" type="radio" name="options">
            {radios}
        </ToggleButtonGroup>
    </>);
}

ButtonChoices.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.string),
};

export class QuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            question: 1,
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch(`/api/get_quiz_data/${this.props.textId}/`);
            const data = await response.json();
            this.setState({ data: data });
        } catch (e) {
            console.log(e);
        }
    }

    nextQuestion() {
        const nextQuestionNumber = this.state.question + 1;
        if (nextQuestionNumber <= this.state.data.length) {
            this.setState({
                question: nextQuestionNumber,
            });
        } else {
            console.log();
        }
    }

    render() {
        if (!this.state.data) {
            return (<p>Loading...</p>);
        }
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
                            <Button id="submit" onClick={() => this.nextQuestion()}>
                                Submit
                            </Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            {/* list of questions for this quiz */}
                        </div>
                        <div className="col-7 shaded-box">
                            <h3>Question</h3>
                            <p>Select the correct conjugation for </p>
                            {this.state.data[this.state.question - 1].sentence}
                            <br />
                            <ButtonChoices
                                choices={this.state.data[this.state.question - 1].options}
                            />
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </React.Fragment>
        );
    }
}

QuizView.propTypes = {
    textId: PropTypes.number,
    sentence: PropTypes.string,
    answer: PropTypes.string,
};

export default QuizView;
