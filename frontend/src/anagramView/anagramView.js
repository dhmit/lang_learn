import React from 'react';
import ReactTooltipDefaultExport from 'react-tooltip';
import Confetti from 'react-dom-confetti';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

const CONFETTI_CONFIG = {
    angle: 90,
    spread: 70,
    startVelocity: 30,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 2500,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const generateFreq = (word) => {
    const freq = {};
    for (let i = 0; i < word.length; i++) {
        const curLetter = word[i].toLowerCase();
        if (curLetter in freq) {
            freq[curLetter]++;
        } else {
            freq[curLetter] = 1;
        }
    }
    return freq;
};

export class AnagramView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            targetWordDefs: null,
            targetWords: [],
            extraWords: [],
            targetExamples: [],
            userInput: '',
            targetWordsFound: [],
            extraWordsFound: [],
            score: 0,
            letters: [],
            gameOver: false,
            timeLeft: 90,
            showModal: false,
            shake: false,
            showConfetti: false,
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.modalHandler = this.modalHandler.bind(this);
    }

    async componentDidMount() {
        await this.startNewGame();
    }

    handleInput = (event) => {
        const inputValue = event.target.value;
        const letterFreq = generateFreq(this.state.letters);
        const curFreq = generateFreq(inputValue);

        for (const key of Object.keys(curFreq)) {
            if (!(key in letterFreq && curFreq[key] <= letterFreq[key])) {
                this.setState({ shake: true, showConfetti: false });
                return;
            }
        }

        this.setState({
            shake: false,
            showConfetti: false,
            userInput: inputValue,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const userInput = this.state.userInput.toLowerCase().trim();
        const targetWords = this.state.targetWords.map((word) => (word.toLowerCase()));
        const targetWordsFound = this.state.targetWordsFound;
        const extraWords = this.state.extraWords;
        if (targetWords.includes(userInput) && !targetWordsFound.includes(userInput)) {
            this.setState({
                showConfetti: true,
                targetWordsFound: this.state.targetWordsFound.concat(userInput),
                score: this.state.score + (userInput.length * 2),
            });
            if (targetWords.length === targetWordsFound.length + 1) {
                this.setState({
                    gameOver: true,
                });
            }
        } else if (extraWords.has(userInput) && !this.state.extraWordsFound.includes(userInput)) {
            this.setState({
                showConfetti: true,
                extraWordsFound: this.state.extraWordsFound.concat(userInput),
                score: this.state.score + userInput.length,
            });
        } else {
            this.setState({ shake: true });
        }
        this.setState({
            userInput: '',
        });
    }

    handleShuffle = (event) => {
        event.preventDefault();
        this.setState({
            letters: shuffleArray(this.state.letters),
        });
    }

    pauseTimer = () => {
        clearInterval(this.timer);
        this.timer = 0;
    };

    modalHandler = (event) => {
        event.preventDefault();
        if (this.state.showModal) this.startTimer();
        else this.pauseTimer();
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    reset() {
        this.setState({
            targetWordDefs: null,
            targetWords: [],
            extraWords: [],
            targetExamples: [],
            userInput: '',
            targetWordsFound: [],
            extraWordsFound: [],
            score: 0,
            letters: [],
            gameOver: false,
            timeLeft: 90,
            shake: false,
            showConfetti: false,
        });
        this.timer = 0;
    }

    startNewGame = async () => {
        this.reset();
        try {
            const apiURL = `/api/get_anagram/${this.props.textID}/${this.props.partOfSpeech}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            const targetWords = [];
            let letters = [];
            const targetWordDefs = [];
            const targetExamples = [];
            const wordData = data['word_data'];
            for (let i = 0; i < wordData.length; i++) {
                const curData = wordData[i];
                const word = curData['word'];
                const examples = curData['example'];
                targetWords.push(word);
                targetWordDefs.push(curData['definition']);
                if (examples.length === 0) {
                    targetExamples.push(['N/A']);
                } else {
                    targetExamples.push(curData['example']);
                }
            }
            for (let i = 0; i < (data['letters']).length; i++) {
                letters.push(data['letters'][i].toUpperCase());
            }
            const extraWordsSet = new Set(data['extra_words']);
            letters = shuffleArray(letters);
            this.setState({
                targetWordDefs: targetWordDefs,
                extraWords: extraWordsSet,
                targetWords: targetWords,
                letters: letters,
                targetExamples: targetExamples,
            });
            this.startTimer();
        } catch (e) {
            console.log(e);
        }
    }

    giveUp = () => {
        this.setState({
            gameOver: true,
        });
    }

    startTimer = () => {
        if (this.timer === 0 && this.state.timeLeft > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown = () => {
        if (this.state.gameOver) {
            clearInterval(this.timer);
        } else {
            const newTimeLeft = this.state.timeLeft - 1;
            if (newTimeLeft === 0 || this.state.gameOver) {
                clearInterval(this.timer);
                this.setState({ gameOver: true });
            }
            this.setState({ timeLeft: newTimeLeft });
        }
    }

    render() {
        if (!this.state.targetWordDefs) {
            return (<LoadingPage loadingText='Creating Anagram Quiz...' />);
        }

        /*
         * Words Found
         */
        const wordsFound = this.state.targetWords.map((word, i) => {
            if (this.state.gameOver) {
                return (
                    <div key={i}>
                        <li>
                            <span data-tip data-for={word}>
                                {word.toUpperCase()}
                            </span>
                        </li>
                        <ReactTooltipDefaultExport id={word} place="right">
                            Examples:
                            <ol>
                                {
                                    this.state.targetExamples[i]
                                        .map((ex, j) => (
                                            <li key={j}>
                                                {ex}
                                            </li>
                                        ))
                                }
                            </ol>
                        </ReactTooltipDefaultExport>
                    </div>
                );
            }
            if (this.state.targetWordsFound.includes(word.toLowerCase())) {
                return (
                    <div key={i}>
                        <li>
                            <span data-tip data-for={word}>
                                {word.toUpperCase()}
                            </span>
                        </li>
                        <ReactTooltipDefaultExport id={word} place="right">
                            Examples:
                            <ol>
                                {
                                    this.state.targetExamples[i]
                                        .map((ex, j) => {
                                            return (
                                                <li key={j}>
                                                    {ex}
                                                </li>
                                            );
                                        })
                                }
                            </ol>
                        </ReactTooltipDefaultExport>
                    </div>
                );
            }
            let buffer = '';
            for (let j = 0; j < word.length; j++) {
                buffer += '_ ';
            }
            return (
                <div key={i}>
                    <li>
                        <span data-tip data-for={word}>{buffer}</span>
                    </li>
                    <ReactTooltipDefaultExport id={word} place="right">
                        Examples:
                        <ol>
                            {
                                this.state.targetExamples[i]
                                    .map((ex, j) => {
                                        return (
                                            <li key={j}>
                                                {ex.replaceAll(word, buffer)}
                                            </li>
                                        );
                                    })
                            }
                        </ol>
                    </ReactTooltipDefaultExport>
                </div>
            );
        });

        /*
         * Definitions
         */
        const definitions = this.state.targetWordDefs.map((defs, i) => {
            if (defs.length === 0) {
                return (
                    <li key={i}>
                        <span>N/A</span>
                    </li>
                );
            }
            return (
                <div key={i}>
                    <li data-tip data-for={`${i}`}>
                        <span>{defs[0]}</span>
                    </li>
                    <ReactTooltipDefaultExport
                        id={`${i}`}
                        place="top"
                    >
                        Definitions:
                        <ol>
                            {
                                defs.map((def, j) => (
                                    <li key={j}>
                                        {def}
                                    </li>
                                ))
                            }
                        </ol>
                    </ReactTooltipDefaultExport>
                </div>
            );
        });

        const enteredFreq = generateFreq(this.state.userInput);
        const curFreq = {};
        for (const key of Object.keys(enteredFreq)) {
            curFreq[key] = 0;
        }
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <div className="row">
                    <div className="col">
                        <h1>
                            Anagrams
                            <button className="btn btn-outline-light btn-circle mx-3"
                                style= {{ 'border': '3px solid', 'fontSize': '20px' }}
                                onClick={this.modalHandler}>
                                <b>?</b>
                            </button>
                        </h1>
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
                                <button type="button" className="close" onClick={this.modalHandler}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Instructions will go here.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    onClick={this.modalHandler}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div className="col text-right">
                        <h4>Time Left: {this.state.timeLeft}</h4>
                    </div>
                </div>
                <h4 style= {{ 'paddingBottom': '5px' }}>Category: {this.props.partOfSpeech}</h4>
                {
                    this.state.gameOver
                        ? <div className="alert alert-success" role="alert">
                            Congratulations! You found <b>
                                {this.state.targetWordsFound.length}
                            </b> of the target words!
                            Click restart to start a new game!
                        </div>
                        : null
                }
                <div className="row">
                    <div className="col-6 text-left">
                        <button type="button" className="btn btn-primary"
                            disabled={!this.state.gameOver}
                            onClick={this.startNewGame}>Restart</button>
                        <button className="btn btn-danger mx-3"
                            onClick={this.giveUp}
                            disabled={this.state.gameOver}>Give Up</button>
                    </div>
                    <div className="col text-right">
                        <span className="score">Score: {this.state.score}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col shaded-box" >
                        <h3>Extra Words</h3>
                        <ul>
                            {
                                this.state.extraWordsFound.map((word, i) => (
                                    <li key={i}>
                                        {word.toUpperCase()}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col shaded-box mx-4">
                        <h3>Words Found</h3>
                        <ol>{wordsFound}</ol>
                    </div>
                    <div className="col-6 shaded-box">
                        <h3>Definitions</h3>
                        <Confetti active={this.state.showConfetti} config={CONFETTI_CONFIG}/>
                        <ol>{definitions}</ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3" >
                        <button className="btn btn-outline-light float-right"
                            onClick={this.handleShuffle}
                            disabled={this.state.gameOver}>
                            <img className="shuffle-icon" src='../../static/img/shuffle.png'/>
                        </button>
                    </div>
                    <div className="col-9 letters">
                        {
                            this.state.letters.map((letter, k) => {
                                let letterClass = 'light-letter';
                                const letterKey = letter.toLowerCase();
                                if (letterKey in enteredFreq
                                    && curFreq[letterKey] < enteredFreq[letterKey]) {
                                    letterClass = 'dark-letter';
                                    curFreq[letterKey]++;
                                }
                                return (
                                    <span className={letterClass} key={k}>
                                        {letter}
                                    </span>
                                );
                            })
                        }
                    </div>
                </div>
                <br/>
                <div className="row mb-5">
                    <div className="col-3" >
                    </div>
                    <div className="col-9">
                        <form
                            className="form-inline"
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                className={`form-control ${this.state.shake ? 'shake-input' : ''}`}
                                type="text"
                                name="userInput"
                                placeholder="Type here"
                                disabled={this.state.gameOver}
                                onChange={this.handleInput}
                                value={this.state.userInput}
                                autoComplete='off'
                                onAnimationEnd={() => { this.setState({ shake: false }); }}
                            />
                            <button className="btn btn-outline-light mx-2"
                                disabled={this.state.gameOver}
                                type="submit">Enter</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>);
    }
}
AnagramView.propTypes = {
    textID: PropTypes.number,
    partOfSpeech: PropTypes.string,
};
