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
            nextSentence: false,
            userText: '',
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
    }

    playAudio = () => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = this.getCurrentSentence();
        utterance.lang = 'en-US';
        utterance.rate = 1.2;
        speechSynthesis.speak(utterance);
    }

    handleInput = (event) => {
        const inputValue = event.target.value;
        this.setState({
            userText: inputValue,
        });

        // if (';,. '.includes(inputValue.slice(-1))) {
        //     this.createPictureBook(inputValue);
        // }
        console.log('this is the input value:');
        console.log(inputValue);
        console.log('this is the state value:');
        console.log(this.userText);
    };

    handleSubmit = (event) => {
        // const inputValue = ;
        // this.setState({
        //     userText: inputValue,
        // });

        // if (';,. '.includes(inputValue.slice(-1))) {
        this.gradeText();
        // }
        console.log('You have submitted!!!');
        // console.log(inputValue);
        // console.log('this is the state value:');
        // console.log(this.userText);
    };

    gradeText = async (input) => {
        try {
            const apiURL = '/api/get_picturebook_data?content=' + input;
            const response = await fetch(apiURL);
            const pictureBookWords = await response.json();
            pictureBookWords.pop(-1);
            this.setState({ pictureBookWords });
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

    handleKeyDown = (e) => {
        if (['ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
            const { code } = e;
            if (code === 'ArrowLeft') {
                this.changeSentence(-1);
            } else if (code === 'ArrowRight') {
                this.changeSentence(1);
            } else if (code === 'Space') {
                this.playAudio();
            }
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

        const flipcard =
                <div>
                    <div className="flashcard-star-back"
                       onClick={this.playAudio}>
                       {playButton('yellow')}

                    </div>
                    <div className="flashcard-div row">
                        <div className="flashcard-arrows col-1 text-right"
                            onClick={() => this.changeSentence(-1)}
                        >
                                &#60;
                        </div>
                        <div className="flashcard-arrows col-1" onClick={() => this.changeSentence(1)}>
                            &#62;
                        </div>
                    </div>

                </div>;
        // const flipcard = <div>{this.getCurrentSentence()}</div>;

        // <div className="flashcard-error">You do not have any starred cards</div>;
        // const flipcard = card
        //     ? (
        //         <div className="flashcard-div row">
        //             <div
        //                 className="flashcard-arrows col-1 text-right"
        //                 onClick={() => this.changeCard(-1)}
        //             >
        //                 &#60;
        //             </div>
        //             <div className={`flip-card col ${showBack ? 'showBack' : ''}
        //                 ${showNext ? 'showNext' : ''}`}>
        //                 <div
        //                     className="flip-card-inner">
        //                     <div className="flip-card-front">
        //                         <div className="row">
        //                             <div className="col-1" onClick={this.flipCard}>
        //                             </div>
        //                             <div className="col text-center-front" onClick={this.flipCard}>
        //                                 <img className="flashcard-image"
        //                                     src={card.url} alt={card.word.toUpperCase()}/>
        //                             </div>
        //                             <div className="col-1 mx-2">
        //                                 <div className="flashcard-star-front"
        //                                     onClick={this.toggleStar}>
        //                                     {this.isStarred(starOnly
        //                                         ? starredCards[sentenceIndex] : sentenceIndex)
        //                                         ? filledStar('yellow')
        //                                         : star('white')
        //                                     }
        //                                 </div>
        //                                 <div className="flashcard-star-buffer"
        //                                     onClick={this.flipCard}>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <h3 className="click-to-flip" onClick={this.flipCard}>
        //                             Click to flip
        //                         </h3>
        //
        //                     </div>
        //
        //                     <div className="flip-card-back">
        //                         <div className="row">
        //                             <div className="col-1" onClick={this.flipCard}>
        //                             </div>
        //                             <div className="col text-center" onClick={this.flipCard}>
        //                                 <h1 className='flashcard-word'>
        //                                     {card.word.toUpperCase()}
        //                                 </h1>
        //                                 <h2 className="flashcard-info">
        //                                     <b><u>Definition:</u></b> {card.definition[0]}
        //                                 </h2>
        //                                 <h2 className="flashcard-info">
        //                                     <b><u>Example:</u></b> <i>"{card.example[0]}"</i>
        //                                 </h2>
        //                             </div>
        //                             <div className="col-1 mx-2">
        //                                 <div className="flashcard-star-back"
        //                                     onClick={this.toggleStar}>
        //                                     {this.isStarred(starOnly
        //                                         ? starredCards[sentenceIndex] : sentenceIndex)
        //                                         ? filledStar('yellow')
        //                                         : star('white')
        //                                     }
        //                                 </div>
        //                                 <div className="flashcard-star-buffer"
        //                                     onClick={this.flipCard}>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <h3 className="click-to-flip" onClick={this.flipCard}>
        //                             Click to flip
        //                         </h3>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="flashcard-arrows col-1" onClick={() => this.changeCard(1)}>
        //                 &#62;
        //             </div>
        //         </div>)
        //     : <div className="flashcard-error">You do not have any starred cards</div>;

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
                    {flipcard}
                    <div className='row'>
                        <div className="col box">
                            <form id='input-form'>
                                <div className="form-group">
                                    <label>Please write exactly what you hear from the audio.</label>
                                    <textarea className="form-control text-input"
                                            id="content"
                                            rows="10"
                                            onChange={this.handleInput}
                                            value={this.userText}>
                                    </textarea>
                                </div>
                            </form>
                        </div>
                            <div className='col-xl-4 text-right bottom-align-text' id="submit-btn-div">
                                <button type="submit"
                                    className="btn btn-success submit-btn"
                                    form="picturebook-form"
                                    onClick={this.handleSubmit}>
                                    Submit
                                </button>
                        </div>
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
