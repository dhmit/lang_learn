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

        };
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
        });
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

    giveUp = () => {
        this.setState({
            gameOver: true,
        });
    }

    showRules = () => {
        this.setState({
            rules: true,
        });
    }

    render() {
        if (!this.state.targetWordDefs) {
            return (<LoadingPage/>);
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
                <h1>
                    Anagrams
                    <button className="btn btn-outline-light btn-circle mx-3"
                        style= {{ 'border': '3px solid', 'fontSize': '20px' }}
                        onClick={this.showRules} data-tip data-for="anagram-rules">
                        <b>?</b>
                    </button>
                </h1>
                <ReactTooltipDefaultExport id="anagram-rules" place="right"
                    style= {{ 'fontSize': '25px' }}>
                    <h3> INSTRUCTIONS </h3>
                    (Rules will be placed in here !!!!
                    Loook at me !!!!
                    Don't forget me!!!!)
                </ReactTooltipDefaultExport>
                <h4 style= {{ 'padding-bottom': '5px' }}>Category: {this.props.partOfSpeech}</h4>
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
