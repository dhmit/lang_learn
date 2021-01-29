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
            <ToggleButton key={i + 1} variant="outline-light" value={i + 1} className="c-button">
                {choice}
            </ToggleButton>
        );
    });

    return (<>
        <div className="row justify-content-center">
            <ToggleButtonGroup className="text-center" type="radio" name="options">
                {radios}
            </ToggleButtonGroup>
        </div>
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
                    <div className="row justify-content-between" id="top">
                        <div className="exit-button">
                            <p>&lt;</p>
                            {/* Eventually, this button will let you leave the quiz */}
                        </div>
                        <div className="col">
                            <h1 className="quiz-title">Verb Conjugation Quiz</h1>
                            <p className="quiz-author"><i>by Takako Aikawa</i></p>
                        </div>
                        <div className="col text-right submit-button">
                            <Button id="submit" onClick={() => this.nextQuestion()}>
                                Submit
                            </Button>
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="col">
                            {/* list of questions for this quiz */}
                        </div>
                        <div className="col-9 shaded-box">
                            <h3 className="question-title">Question #{this.state.question}</h3>
                            <p className="question-primary-text">
                                Select the correct conjugation for the missing word.
                            </p>
                            <br />
                            {console.log(this.state.data)}
                            <p className="question-secondary-text">
                                {this.state.data[this.state.question - 1].sentence}
                            </p>
                            <br />
                            <ButtonChoices
                                choices={this.state.data[this.state.question - 1].options}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-end">
                        {/* Haha, we're gonna probably need some arrow images */}
                        {/* Also, this is off-centered */}
                        <div className="col-xs">
                            <Button id="arrow" onClick={() => this.nextQuestion()}>
                                &lt;--
                            </Button>
                        </div>
                        <div className="col-5">
                            <Button id="arrow" onClick={() => this.nextQuestion()}>
                                --&gt;
                            </Button>
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
