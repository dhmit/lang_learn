import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

const playButton = (color) => {
    return (
        <svg
            xmlns = "http://www.w3.org/2000/svg"
            viewBox = "0 0 26 26"
            fill = {color}
            className = "bi bi-play-button"
        >
            <polygon
                className="play-btn__svg"
                points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"
            />
            <path
                d={'M26,13A13,13,0,1,1,13,0,13,13,0,0,1,26,13ZM13,2.18A10.89,10.89'
                + ',0,1,0,23.84,13.06,10.89,10.89,0,0,0,13,2.18Z'}
            />
        </svg>
    );
};

export class TextToSpeech extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textData: null,
            sentenceIndex: 0,
            showModal: false,
            userText: '',
            graded: false,
            grade: null,
            continue: false,
            showAnswer: false,
        };
        this.modalHandler = this.modalHandler.bind(this);
    }

    componentDidMount = async () => {
        const apiURL = `/api/get_indiv_sentences/${this.props.textID}`;
        const response = await fetch(apiURL);
        const data = await response.json();
        this.setState({
            textData: data,
        });
        console.log(this.state.textData);
        document.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    getCurrentSentence = () => {
        return this.state.textData[this.state.sentenceIndex]['sentence'];
    }

    changeSentence = (delta) => {
        const { textData, sentenceIndex } = this.state;
        const listLength = textData.length;
        const newsentenceIndex = (sentenceIndex + delta + listLength) % listLength;
        this.setState({
            sentenceIndex: newsentenceIndex,
            showNext: true,
        });
        this.reset();
    }

    reset = async () => {
        this.setState({
            showModal: false,
            userText: '',
            graded: false,
            grade: null,
            continue: false,
            showAnswer: false,
        });
        document.getElementById('content').value = '';
    }

    giveUp = () => {
        this.setState({
            continue: true,
            showAnswer: true,
        });
    }

    playAudio = () => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = this.getCurrentSentence();
        utterance.lang = 'en-US';
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
    }

    handleSubmit = () => {
        const input = document.getElementById('content').value;
        console.log('this is the input i want', input);
        this.setState({
            userText: input,
        });
        this.gradeText(input);

        console.log('You have submitted!!!');
    };

    gradeText = async (input) => {
        console.log('gradeText was called');
        try {
            console.log('im trying something here');
            const apiURL = `/api/get_sentence_grade/${input}/${this.getCurrentSentence()}`;
            const response = await fetch(apiURL);
            const grade = await response.json();
            console.log(grade);

            this.setState({ grade: grade, graded: true });
            this.setState({ continue: grade['isCorrect'] });
        } catch (e) {
            console.log(e);
        }
    }

    modalHandler = (event) => {
        event.preventDefault();
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    checkProgress = () => {
        const numSentences = this.state.textData.length;
        const currentSentence = this.state.sentenceIndex + 1;
        if (numSentences !== 0) {
            return parseInt((currentSentence / numSentences) * 100);
        }
        return 0;
    }

    giveGrade = () => {
        const words = [];
        for (let i = 0; i < this.state.grade['length']; i++) {
            if (this.state.grade[i]['grade'] === 'correct') {
                words.push(
                    <span className="correct-word">{this.state.grade[i]['word']}</span>,
                );
                words.push(<span> </span>);
            } else {
                words.push(
                    <span className="incorrect-word">{this.state.grade[i]['word']}</span>,
                );
                words.push(<span> </span>);
            }
        }
        return words;
    }

    giveMissingWords = () => {
        console.log('missing words was called');
        console.log(this.state.grade['missing']);
        console.log(this.state.grade['missing'].length);
        const words = [];
        for (let i = 0; i < this.state.grade['missing'].length; i++) {
            words.push(
                <p className="missing-words">{this.state.grade['missing'][i]}</p>,
            );
        }

        this.shuffle(words);
        return words;
    }

    shuffle = async (arr) => {
        arr.sort(() => Math.random() - 0.5);
    }

    render() {
        const {
            textData,
            sentenceIndex,
        } = this.state;

        if (!textData) {
            return (<LoadingPage text='Loading Sentences...'/>);
        }

        const sentenceLength = textData.length;
        const progressText = sentenceLength === 0
            ? 'No Sentences Available'
            : `${sentenceIndex + 1}/${sentenceLength} Words`;

        let missingWord = null;
        if (this.state.graded) {
            missingWord = this.giveMissingWords();
        }

        return (
            <>
                <Navbar/>
                <div className='page' onKeyDown={this.handleKeyDown}>
                    <div className='row'>
                        <div className='col-xl-8 col-md-6 col-12 text-center text-md-left'>
                            <h1 className='flashcard-title'>Sentence</h1>
                            <button
                                className="btn btn-outline-light btn-circle instruction"
                                onClick={this.modalHandler}>
                                <b>?</b>
                            </button>
                        </div>
                        <div>
                            {
                                this.state.showModal
                                    ? <div className="backdrop" onClick={this.modalHandler}>
                                    </div>
                                    : null
                            }
                            <div className="Modal modal-content" style={{
                                transform: this.state.showModal
                                    ? 'translateY(0)' : 'translateY(-100vh)',
                                opacity: this.state.showModal ? 1 : 0,
                            }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Instructions</h5>
                                    <button type="button" className="close"
                                        onClick={this.modalHandler}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Click the play button to hear the
                                    sentence. After, type exactly what you hear.
                                     Press submit to see your score! Press give
                                     up if you want the correct answer.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"
                                        onClick={this.modalHandler}>Close</button>
                                </div>
                            </div>
                        </div>

                        <div className='col-xl-4 col-md-6 col-12'>
                            <div className='progress-text'>
                                {progressText}
                            </div>
                            <div className='progress'>
                                <div className="progress-bar progress-bar-striped bg-success"
                                    role="progressbar"
                                    style={{ 'width': `${this.checkProgress()}%` }}
                                    aria-valuenow={this.checkProgress()} aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row answer'>
                        <div className="col-1">
                            <div className="play audio"
                                onClick={this.playAudio}>
                                {playButton('pink')}
                            </div>
                            <div className="play-button-buffer">
                                {null}
                            </div>
                        </div>
                        <div className='col-8 box-answer'>
                            <h2 className='grade-text para'>Here is your grade:</h2>
                            {
                                this.state.graded
                                    ? this.giveGrade()
                                    : <p>You have not submitted yet</p>
                            }
                            {
                                this.state.showAnswer
                                    ? (
                                        <div>
                                            <br/>
                                            <h2 className='para'>This is the correct answer:</h2>
                                            <p>{this.getCurrentSentence()}</p>
                                        </div>
                                    )
                                    : null
                            }
                        </div>
                        <div className='col-3'>
                            <div className='box-missing-words'>
                                <h2 className='para'>Missing Words:</h2>
                                {
                                    this.state.graded
                                        ? (
                                            <div className='row'>
                                                <div className='col missing-words-list'>
                                                    {missingWord.slice(0,
                                                        Math.round(missingWord.length / 2))}
                                                </div>
                                                <div className='col missing-words-list'>{
                                                    missingWord.slice(Math.round(missingWord.length
                                                        / 2), missingWord.length)}
                                                </div>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col box">
                            <form id='input-form'>
                                <div className="form-group">
                                    <label>
                                    Please write exactly what you hear from the audio.
                                    </label>
                                    <textarea
                                        className="form-control text-input"
                                        id="content"
                                        rows="10"
                                        disabled={this.state.continue}>
                                    </textarea>
                                </div>
                            </form>
                        </div>
                        <div className='col-2 sub-div' id="submit-btn-div">
                            <button type="submit"
                                className= 'btn btn-success submit-btn text-middle'
                                form="picturebook-form"
                                onClick={this.handleSubmit}
                                disabled={this.state.continue}>
                                Submit
                            </button>
                        </div>
                    </div>
                    <div>
                        {
                            this.state.continue
                                ? (
                                    <div className="row bot-but">
                                        <button type="submit"
                                            className={'btn btn-success give-up-btn col-6 '
                                            + 'text-middle bottom-align-text hide-button'}
                                            form="picturebook-form">
                                            Give Up
                                        </button>
                                        <button type="submit"
                                            className={'btn btn-success continue-btn col-6'
                                            + ' text-middle bottom-align-text'}
                                            form="picturebook-form"
                                            onClick={() => this.changeSentence(1)}>
                                            Next
                                        </button>
                                    </div>

                                )
                                : (
                                    <div className="row bot-but">
                                        <button type="submit"
                                            className={'btn btn-success give-up-btn col-6'
                                            + ' text-middle bottom-align-text'}
                                            form="picturebook-form"
                                            onClick={this.giveUp}>
                                            Give Up
                                        </button>
                                        <button type="submit"
                                            className={'btn btn-success continue-btn '
                                            + 'col-6 text-middle bottom-align-text hide-button'}
                                            form="picturebook-form">
                                            Next
                                        </button>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <Footer/>
            </>
        );
    }
}
TextToSpeech.propTypes = {
    textID: PropTypes.number,
};
