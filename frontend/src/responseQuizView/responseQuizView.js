import React from 'react';
import './responseQuizView.scss';
// import ReactTooltipDefaultExport from 'react-tooltip';
import * as PropTypes from 'prop-types';
import {
    Button,
    ToggleButton,
    ToggleButtonGroup,
} from 'react-bootstrap';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

// This dictionary maps specific error types to their respective error message.
const ERROR_DESCRIPTIONS = {
    'backwards': 'The letters are reversed',
    'verb-conjugation': 'One or more verbs are incorrectly conjugated',
    'comma-splice': 'Two independent clauses are incorrectly joined by a comma',
    'run-on': 'There is a run on sentence',
    'homophone': 'Misuse of a similar sounding word (homophone)',
    'verb-deletion': 'This sentence doesn\'t contain a verb.',
};

export class ResponseQuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: false,
            question: 1,
            userAnswers: {},
            score: 0,
            graded: false,
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch(`/api/get_response_quiz_data/${this.props.textID}/`);
            if (!response.ok) {
                console.log('Something went wrong :(');
                this.setState({error: true});
            } else {
                const questionData = await response.json();
                this.setState({data: questionData});
            }
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
        }
    }

    prevQuestion() {
        const prevQuestionNumber = this.state.question - 1;
        if (prevQuestionNumber > 0) {
            this.setState({
                question: prevQuestionNumber,
            });
        }
    }

    getUnanswered() {
        let numUnanswered = 0;
        const answers = this.state.userAnswers;
        for (let i = 1; i <= this.state.data.length; i++) {
            if (answers[i] === undefined) {
                numUnanswered++;
            }
        }
        return numUnanswered;
    }

    gradeQuiz() {
        let cSubmit;
        if (this.getUnanswered() === 0) {
            cSubmit = window.confirm('Are you sure that you want to submit your quiz? Your'
                + ' answers are final.');
        } else {
            cSubmit = window.confirm('Are you sure that you want to submit your quiz? You'
                + ' have ' + this.getUnanswered() + ' unanswered questions(s).');
        }
        if (cSubmit === true) {
            this.setState({ graded: true });
            let score = 0;
            const answers = this.state.userAnswers;
            for (let i = 0; i < this.state.data.length; i++) {
                if (answers[i + 1] === this.state.data[i].answer) {
                    score += 1;
                }
            }
            this.setState({ score: score });
        } else {
            console.log();
        }

        // Brings the user back to the first question (beginning of the quiz) upon submission.
        this.setState({ question: 1 });
    }

    onProgressBarClick = (event) => {
        this.setState({
            ...this.state,
            question: parseInt(event.target.value),
        });
    }

    onAnswerChoiceClick = (event) => {
        const currentQ = this.state.question;
        if ((typeof event.target.value) === 'undefined') {
            console.log();
        } else if (!this.state.graded) {
            const answers = this.state.userAnswers;
            answers[currentQ] = event.target.value;
            this.setState({ userAnswers: answers });
        }
    }

    render() {
        if (this.state.error) {
            // Eventually create a better error page
            return (<p>Something is broken. Consider fixing that. ¯\_(ツ)_/¯</p>);
        }
        if (!this.state.data) {
            return (<LoadingPage />);
        }

        const displayFeedback = () => {
            // This function is only called if the user selects an answer.
            const currQ = this.state.question;
            const choices = this.state.data[currQ - 1].options;
            const userChoice = this.state.userAnswers[currQ];
            const choiceIndex = choices.findIndex((obj) => (obj.text) === userChoice);
            const errorTypes = this.state.data[currQ - 1].options[choiceIndex]['error-types'];
            if (errorTypes.length === 0) {
                return (<>
                    You chose the correct answer. Congratulations!
                </>);
            }
            const errors = errorTypes.map((error, i) => {
                let errorText = error;
                if (errorText in ERROR_DESCRIPTIONS) {
                    errorText = ERROR_DESCRIPTIONS[errorText];
                }
                return (
                    <li key={i}>{errorText}</li>
                );
            });
            return (<>
                The answer choice you selected had the following errors:
                <ul>
                    {errors}
                </ul>
            </>);
        };

        const displayQuestion = () => {
            const choices = this.state.data[this.state.question - 1].options;

            const radios = choices.map((choice, i) => {
                const choiceText = choice['text'];
                return (
                    <ToggleButton
                        key={i + 1}
                        variant="outline-light"
                        value={choiceText}
                        className="c-button"
                        onClick={this.onAnswerChoiceClick}
                    >
                        {choiceText}
                    </ToggleButton>
                );
            });

            return (
                <ToggleButtonGroup
                    className="text-center"
                    type="radio"
                    name="options"
                    value={this.state.userAnswers[this.state.question]}
                >
                    {radios}
                </ToggleButtonGroup>
            );
        };

        return (
            <React.Fragment>
                <Navbar />
                <div className="page">
                    <div className="row justify-content-between" id="top">
                        <a className="exit-button" href={'/response_quiz'}>
                            <p>&lt;</p>
                            {/* Eventually, this button will let you leave the quiz */}
                        </a>
                        <div className="col">
                            <h1 className="quiz-title">Dialogue Quiz</h1>
                            <p className="quiz-author"><i>by Takako Aikawa</i></p>
                        </div>
                        <div className="col text-right submit-button">
                            {(this.state.graded)
                                ? <p id="score">
                                    Score:&nbsp;
                                    {this.state.score}/{this.state.data.length}
                                </p>
                                : <Button id="submit" onClick={() => this.gradeQuiz()}>
                                        Submit
                                </Button>
                            }
                        </div>
                    </div>
                    <div className="row justify-content-between" id="middle">
                        <div className="col pb-scroll" id="scrolling">
                            {
                                this.state.data.map((questionData, key) => {
                                    const qNumber = key + 1;
                                    let qStatus = 'Unanswered';
                                    const answers = this.state.userAnswers;

                                    if (this.state.graded) {
                                        if (qNumber in answers) {
                                            const userAnswer = answers[qNumber];
                                            const correctAnswer = this.state.data[key].answer;
                                            if (userAnswer === correctAnswer) {
                                                qStatus = 'Correct';
                                            } else {
                                                qStatus = 'Incorrect';
                                            }
                                        }
                                    } else {
                                        for (const i in answers) {
                                            if (qNumber.toString() === i) {
                                                qStatus = 'Answered';
                                            }
                                        }
                                    }

                                    if (!this.state.graded && this.state.question === qNumber) {
                                        qStatus = 'Current';
                                    }

                                    return (<>
                                        <button
                                            type="button"
                                            value={key + 1}
                                            key={key + 1}
                                            className="pb-question"
                                            onClick={this.onProgressBarClick}
                                        >
                                            Question #{qNumber}
                                        </button>
                                        <p className="pb-status"><i>{qStatus}</i></p>
                                    </>);
                                })
                            }
                        </div>
                        <div className="col-9 shaded-box">
                            <h3 className="question-title">Question #{this.state.question}</h3>
                            <p className="question-primary-text">
                                Respond to the prompt below:
                            </p>
                            <br />
                            <p className="question-secondary-text">
                                {this.state.data[this.state.question - 1].question}
                            </p>
                            <br />
                            {(this.state.graded)
                                ? <div>
                                    <p>
                                        <b className="results-header">Your Response</b>
                                        <br />
                                        <p className="results-text">
                                            Your answer: {(Object.prototype.hasOwnProperty.call(
                                                this.state.userAnswers,
                                                this.state.question,
                                            ))
                                                ? <>{this.state.userAnswers[this.state.question]}</>
                                                : <i>Unanswered</i>}
                                        </p>
                                        <p className="results-text">
                                            Correct answer: {
                                                this.state.data[this.state.question - 1].answer
                                            }
                                        </p>
                                    </p>
                                    <b className="results-header">Machine-Generated Feedback</b>
                                    <br />
                                    <p className="results-text">
                                        {(Object.prototype.hasOwnProperty.call(
                                            this.state.userAnswers,
                                            this.state.question,
                                        ))
                                            ? <>{displayFeedback()}</>
                                            : <i>No feedback.</i>}
                                    </p>
                                </div> : <div className="row justify-content-center">
                                    {displayQuestion()}
                                </div>}
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="col">
                        </div>
                        <div className="col-9">
                            <div className="row justify-content-center">
                                {((this.state.question - 1) === 0)
                                    ? <Button id="arrow" disabled>
                                        &larr;
                                    </Button>
                                    : <Button id="arrow" onClick={() => this.prevQuestion()}>
                                        &larr;
                                    </Button>
                                }
                                &nbsp;&nbsp;&nbsp;
                                {((this.state.question + 1) > this.state.data.length)
                                    ? <Button id="arrow" disabled>
                                        &rarr;
                                    </Button>
                                    : <Button id="arrow" onClick={() => this.nextQuestion()}>
                                        &rarr;
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

ResponseQuizView.propTypes = {
    textID: PropTypes.number,
    sentence: PropTypes.string,
    answer: PropTypes.string,
};

export default ResponseQuizView;
