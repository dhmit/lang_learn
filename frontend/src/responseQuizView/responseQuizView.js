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


export class ResponseQuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            question: 1,
            userAnswers: {},
            score: 0,
            graded: false,
        };
    }

    async componentDidMount() {
        try {
            // TODO: Run an API that pulls the quiz data from the backend.
            const response = await fetch(`/api/get_quiz_data/${this.props.textID}/`);
            const data = await response.json();
            // const data = [
            //     {
            //         'sentence': 'Hi! My name is Maria.',
            //         'answer': 'Hi! My name is Bob.',
            //         'options': ['Bye!', 'Hi! My name is Bob.', '76, actually.', 'You\'re weird.'],
            //         'type': 'mc',
            //     },
            //     {
            //         'sentence': 'How are you?',
            //         'answer': 'Great!',
            //         'options': ['No.', 'Hi! My name is Bob.', 'Bye!', 'Great!'],
            //         'type': 'mc',
            //     },
            //     {
            //         'sentence': 'What\'s your favorite color?',
            //         'answer': 'Purple.',
            //         'type': 'fr',
            //     }
            // ];
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

    prevQuestion() {
        const prevQuestionNumber = this.state.question - 1;
        if (prevQuestionNumber > 0) {
            this.setState({
                question: prevQuestionNumber,
            });
        } else {
            console.log();
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
        // TODO: Write the API request that will send the user's answers to the backend for grading
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

    onTextChange = (event) => {
        const answers = this.state.userAnswers;
        answers[this.state.question] = event.target.value;
        this.setState({ userAnswers: answers });
    }

    render() {
        if (!this.state.data) {
            return (<LoadingPage />);
        }

        const displayQuestion = () => {
            if (this.state.data[this.state.question - 1].type === 'mc') {
                const choices = this.state.data[this.state.question - 1].options;

                const radios = choices.map((choice, i) => {
                    return (
                        <ToggleButton
                            key={i + 1}
                            variant="outline-light"
                            value={choice}
                            className="c-button"
                            onClick={this.onAnswerChoiceClick}
                        >
                            {choice}
                        </ToggleButton>
                    );
                });

                return (<>
                    <ToggleButtonGroup
                        className="text-center"
                        type="radio"
                        name="options"
                        value={this.state.userAnswers[this.state.question]}
                    >
                        {radios}
                    </ToggleButtonGroup>
                </>);
            }
            if (this.state.data[this.state.question - 1].type === 'fr') {
                return (<>
                    <input
                        type="text"
                        value={this.state.userAnswers[this.state.question]}
                        onChange={this.onTextChange}
                    />
                </>);
            }
            return null;
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
                            <h1 className="quiz-title">Verb Conjugation Quiz</h1>
                            <p className="quiz-author"><i>by Takako Aikawa</i></p>
                        </div>
                        <div className="col text-right submit-button">
                            {(this.state.graded)
                                ? <p id="score">
                                    Score:&nbsp;
                                    {this.state.score}/{this.state.data.length}
                                </p>
                                : <Button id="submit">
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
                                        if (Object.prototype.hasOwnProperty.call(
                                            answers,
                                            qNumber,
                                        )) {
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
                                            if (Object.prototype.hasOwnProperty.call(answers, i)) {
                                                if (qNumber.toString() === i) {
                                                    qStatus = 'Answered';
                                                }
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
                                {this.state.data[this.state.question - 1].sentence}
                            </p>
                            <br />
                            <div className="row justify-content-center">
                                {(this.state.graded)
                                    ? <p className="results">
                                        Your answer: {(Object.prototype.hasOwnProperty.call(
                                            this.state.userAnswers,
                                            this.state.question,
                                        ))
                                            ? <>{this.state.userAnswers[this.state.question]}</>
                                            : <i>Unanswered</i>}
                                        <br />
                                        Correct answer: {
                                            this.state.data[this.state.question - 1].answer
                                        }
                                    </p>
                                    : displayQuestion()
                                }
                            </div>
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
