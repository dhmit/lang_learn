import React from 'react';
import ReactTooltipDefaultExport from 'react-tooltip';
import * as PropTypes from 'prop-types';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

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

    handleChange = (event) => {
        const inputValue = event.target.value;
        const stateField = event.target.name;
        this.setState({
            [stateField]: inputValue,
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
                extraWordsFound: this.state.extraWordsFound.concat(userInput),
                score: this.state.score + userInput.length,
            });
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
            return (<LoadingPage text='Creating Anagram Quiz...'/>);
        }

        /*
         * Words Found
         */
        const wordsFound = this.state.targetWords.map((word, i) => {
            if (this.state.gameOver) {
                return (
                    <>
                        <li key={i}>
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
                    </>
                );
            }
            if (this.state.targetWordsFound.includes(word.toLowerCase())) {
                return (
                    <>
                        <li key={i}>
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
                    </>
                );
            }
            let buffer = '';
            for (let j = 0; j < word.length; j++) {
                buffer += '_ ';
            }
            return (
                <>
                    <li key={i}>
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
                </>
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
                <>
                    <li data-tip data-for={defs[0]} key={i}>
                        <span>{defs[0]}</span>
                    </li>
                    <ReactTooltipDefaultExport
                        id={defs[0]}
                        place="top"
                        effect="solid"
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
                </>
            );
        });

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
                        {this.state.letters}
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-3" >
                    </div>
                    <div className="col-9">
                        <form className="form-inline" onSubmit={this.handleSubmit}>
                            <input className="form-control" type="text" name="userInput"
                                placeholder="Type here" disabled={this.state.gameOver}
                                onChange={this.handleChange} value={this.state.userInput} />
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
