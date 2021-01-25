import React from 'react';
import ReactTooltipDefaultExport from 'react-tooltip';
import * as PropTypes from 'prop-types';
import { Navbar, Footer } from '../UILibrary/components';

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
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShuffle = this.handleShuffle.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
    }

    async componentDidMount() {
        await this.startNewGame();
    }

    handleChange(event) {
        const inputValue = event.target.value;
        const stateField = event.target.name;
        this.setState({
            [stateField]: inputValue,
        });
    }

    handleSubmit(event) {
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

    handleShuffle(event) {
        event.preventDefault();
        this.setState({
            letters: shuffleArray(this.state.letters),
        });
    }

    reset() {
        this.setState({
            targetWordDefs: null,
            targetWords: [],
            extraWords: [],
            userInput: '',
            targetWordsFound: [],
            extraWordsFound: [],
            score: 0,
            letters: [],
            gameOver: false,
        });
    }

    async startNewGame() {
        this.reset();
        try {
            const apiURL = `/api/get_anagram/${this.props.textID}/${this.props.partOfSpeech}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            const targetWords = [];
            let letters = [];
            const targetWordDefs = [];
            const targetExamples = [];
            for (let i = 0; i < (data['word_data']).length; i++) {
                const word = data['word_data'][i];
                const examples = word[1]['example'];
                targetWords.push(word[0]);
                targetWordDefs.push(word[1]['definition']);
                if (examples.length === 0) {
                    targetExamples.push(['N/A']);
                } else {
                    targetExamples.push(word[1]['example']);
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
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.targetWordDefs) {
            return (
                <div className="spinner-border text-primary" role="status" >
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <h1>Anagrams</h1>
                {
                    this.state.gameOver
                        ? <div className="alert alert-success" role="alert">
                            Congratulations! You found all the target words!
                            Click restart to start a new game!
                        </div>
                        : null
                }
                <div className="row">
                    <div className="col-6 text-left">
                        {!this.state.gameOver
                            ? <button type="button"
                                className="btn btn-secondary" disabled>Restart</button>
                            : <button type="button"
                                className="btn btn-secondary"
                                onClick={this.startNewGame}>Restart</button>
                        }
                    </div>
                    <div className="col-6 text-right">
                        <h4><span className="score">Score: {this.state.score}</span></h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col shaded-box" >
                        <h3>Extra Words</h3>
                        <ul>
                            {
                                this.state.extraWordsFound.map((word, i) => (
                                    <li key={i}>
                                        {word}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col shaded-box mx-4">
                        <h3>Words Found</h3>
                        <ol>
                            {
                                this.state.targetWords.map((word, i) => {
                                    if (this.state.targetWordsFound.includes(word.toLowerCase())) {
                                        return (
                                            <>
                                                <li key={i}>
                                                    <span data-tip data-for={word}>{word}</span>
                                                </li>
                                                <ReactTooltipDefaultExport id={word} place="right"
                                                    effect="solid">
                                                    Examples:
                                                    <br/>
                                                    {
                                                        this.state.targetExamples[i]
                                                            .map((example, j) => {
                                                                if (j + 1 !== this.state
                                                                    .targetExamples[i].length) {
                                                                    return (
                                                                        <>
                                                                            {example}
                                                                            <br/>
                                                                        </>
                                                                    );
                                                                }
                                                                return example;
                                                            })
                                                    }
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
                                            <ReactTooltipDefaultExport
                                                id={word}
                                                place="right"
                                                effect="solid"
                                            >
                                                Examples:
                                                <br/>
                                                {
                                                    this.state.targetExamples[i].map((ex, j) => {
                                                        const example = ex.replace(word, buffer);
                                                        if (j + 1
                                                          !== this.state.targetExamples[i].length) {
                                                            return (
                                                                <>
                                                                    {example}
                                                                    <br/>
                                                                </>
                                                            );
                                                        }
                                                        return example;
                                                    })
                                                }
                                            </ReactTooltipDefaultExport>
                                        </>
                                    );
                                })}
                        </ol>
                    </div>
                    <div className="col-6 shaded-box">
                        <h3>Definitions</h3>
                        <ol>
                            {
                                this.state.targetWordDefs.map((defs, i) => {
                                    if (defs === '') {
                                        return (
                                            <li key={i}>
                                                <span>N/A</span>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li data-tip data-for={defs[0]} key={i}>
                                            <ReactTooltipDefaultExport
                                                id={defs[0]}
                                                place="top"
                                                effect="solid"
                                            >
                                                Definitions:
                                                <br/>
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
                                            {defs[0]}
                                        </li>
                                    );
                                })
                            }
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3" >
                        <button className="btn btn-outline-dark float-right"
                            onClick={this.handleShuffle}>
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
                            <button className="btn btn-outline-dark mx-2"
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
