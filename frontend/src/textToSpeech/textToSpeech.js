import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

// const synth = window.speechSynthesis;

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
                d="M26,13A13,13,0,1,1,13,0,13,13,0,0,1,26,13ZM13,2.18A10.89,10.89,0,1,0,23.84,13.06,10.89,10.89,0,0,0,13,2.18Z"
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
        const {
            sentenceIndex,
            textData,
        } = this.state;
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

    reset = async (input) => {
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

    giveUp = (event) => {
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

    // handleInput = (event) => {
    //     const inputValue = event.target.value;
    //     this.setState({
    //         userText: inputValue,
    //     });
    //
    //     // if (';,. '.includes(inputValue.slice(-1))) {
    //     //     this.createPictureBook(inputValue);
    //     // }
    //     // console.log('this is the input value:');
    //     // console.log(inputValue);
    //     console.log('this is the state value:');
    //     console.log(this.state.userText);
    // };

    handleSubmit = (event) => {
        // const inputValue = ;
        // this.setState({
        //     userText: inputValue,
        // });
        const input = document.getElementById('content').value;
        // if (';,. '.includes(inputValue.slice(-1))) {
        console.log('this is the input i want', input);
        // const input = this.state.userText;  // + ';%20' + this.getCurrentSentence();
        this.setState({
            userText: input,
        });
        this.gradeText(input);
        // this.createPictureBook(input);
        // }
        console.log('You have submitted!!!');
        // console.log(inputValue);
        // console.log('this is the state value:');
        // console.log(this.userText);
    };

    gradeText = async (input) => {
        console.log('gradeText was called');
        try {
            console.log('im trying something here');
            const apiURL = `/api/get_sentence_grade/${input}/${this.getCurrentSentence()}`;
            // const apiURL = '/api/get_sentence_grade?content=' + input + '?content2=' + this.getCurrentSentence();
            // const apiURL = '/api/get_picturebook_data?content=' + input;
            const response = await fetch(apiURL);
            const grade = await response.json();
            // this.setState({ pictureBookWords });
            console.log(grade);

            this.setState({grade: grade, graded: true});
            this.setState({continue: grade['isCorrect']});
        } catch (e) {
            console.log(e);
        }
    }

    // toggleStar = () => {
    //     const { starredCards, starOnly, cardIndex } = this.state;
    //     let currentIndex = starOnly ? starredCards[cardIndex] : cardIndex;
    //     if (this.isStarred(currentIndex)) {
    //         starredCards.splice(starredCards.indexOf(currentIndex), 1);
    //         if (starOnly) {
    //             if (starredCards.length > 0) {
    //                 currentIndex %= starredCards.length;
    //             } else {
    //                 currentIndex = 0;
    //             }
    //         }
    //     } else {
    //         starredCards.push(this.state.cardIndex);
    //     }
    //     this.setState({ starredCards, cardIndex: currentIndex });
    // }

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
            // let word = this.state.grade[i]['word']
            if (this.state.grade[i]['grade'] === 'correct') {
                // const color = '#3ED7AF';
                words.push(
                    <span className="correct-word">{this.state.grade[i]['word']}&nbsp;</span>
                );
            } else {
                // const color = '#F64F4F';
                words.push(
                    <span className="incorrect-word">{this.state.grade[i]['word']}&nbsp;</span>
                    // <span style='color: #F64F4F'>{this.state.grade[i]['word']}</span>
                );
            }
        }
        return words;
        // return <p>i am trying</p>;
            // words.push(
            //     <span style='color: color} >{this.state.grade[i]['word']}</span>
            // );
            // if incorrect, color == this
    }

    render() {
        const {
            textData,
            showNext,
            sentenceIndex,
        } = this.state;

        if (!textData) {
            return (<LoadingPage text='Loading Sentences...'/>);
        }

        /* Generate Text On Top of Progress Bar */
        const sentenceLength = textData.length;
        const progressText = sentenceLength === 0
            ? 'No Sentences Available'
            : `${sentenceIndex + 1}/${sentenceLength} Words`;

        /* Generate Flashcard */
        const card = this.getCurrentSentence();
        // const flipcard = <div className="flashcard-star-back"
        //                        onClick={this.playAudio}>
        //                        {playButton('yellow')}
        //
        //                   </div>;

        /* Actual Return statement */
        return (
            <>
                <Navbar/>
                <div className='page' onKeyDown={this.handleKeyDown}>
                    <div className='row'>
                        <div className='col-xl-8 col-md-6 col-12 text-center text-md-left'>
                            <h1 className='flashcard-title'>Sentence</h1>
                            <button
                                className="btn btn-outline-light btn-circle flashcard-instruction"
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
                                    <p></p>
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
                    <div>
                        <div className="play audio"
                           onClick={this.playAudio}>
                           {playButton('yellow')}
                        </div>
                    </div>
                    {
                        this.state.graded
                        ? this.giveGrade()
                        : null
                    }
                    {
                        this.state.showAnswer
                        ? (
                            <div>
                                <p>This is the correct answer:</p>
                                <p>{this.getCurrentSentence()}</p>
                            </div>
                        )
                        : null
                    }
                    <div className='row'>
                        <div className="col box">
                            <form id='input-form'>
                                <div className="form-group">
                                    <label>Please write exactly what you hear from the audio.</label>
                                    <textarea
                                        className="form-control text-input"
                                        id="content"
                                        rows="10"
                                        disabled={this.state.continue}>
                                    </textarea>
                                </div>
                            </form>
                        </div>
                        <div className='col-2 text-right bottom-align-text' id="submit-btn-div">
                            <button type="submit"
                                className="btn btn-success submit-btn"
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
                                <div className="row">
                                  <button type="submit"
                                      className="btn btn-success give-up-btn col-6 text-middle bottom-align-text hide-button"
                                      form="picturebook-form">
                                      Give Up
                                  </button>
                                  <button type="submit"
                                      className="btn btn-success continue-btn col-6 text-middle bottom-align-text"
                                      form="picturebook-form"
                                      onClick={() => this.changeSentence(1)}>
                                      Next
                                  </button>
                                </div>

                            )
                            : (
                              <div className="row">
                                <button type="submit"
                                    className="btn btn-success give-up-btn col-6 text-middle bottom-align-text"
                                    form="picturebook-form"
                                    onClick={this.giveUp}>
                                    Give Up
                                </button>
                                <button type="submit"
                                    className="btn btn-success continue-btn col-6 text-middle bottom-align-text hide-button"
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
    textID: PropTypes.number
};
