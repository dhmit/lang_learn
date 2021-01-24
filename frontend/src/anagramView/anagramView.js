import React from 'react';
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
            userInput: null,
            targetWordsFound: [],
            extraWordsFound: [],
            score: 0,
            letters: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShuffle = this.handleShuffle.bind(this);
    }

    async componentDidMount() {
        try {
            const apiURL = `/api/get_anagram/${this.props.textID}/noun`;
            const response = await fetch(apiURL);
            const data = await response.json();
            const targetWords = [];
            let letters = [];
            const targetWordDefs = [];
            for (let i = 0; i < (data['word_data']).length; i++) {
                const word = data['word_data'][i];
                targetWords.push(word[0]);
                targetWordDefs.push(word[1]['definition']);
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
            });
        } catch (e) {
            console.log(e);
        }
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
        const userInput = this.state.userInput.toLowerCase();
        const targetWords = this.state.targetWords;
        const extraWords = this.state.extraWords;
        if (targetWords.includes(userInput) && !this.state.targetWordsFound.includes(userInput)) {
            this.setState({
                targetWordsFound: this.state.targetWordsFound.concat(userInput),
                score: this.state.score + (userInput.length * 2),
            });
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
                <div className="text-right">
                    <h4><span className="score">Score: {this.state.score}</span></h4>
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
                                    if (this.state.targetWordsFound.includes(word)) {
                                        return (
                                            <li key={i}>
                                                <span>{word}</span>
                                            </li>
                                        );
                                    }
                                    let buffer = '';
                                    for (let j = 0; j < word.length; j++) {
                                        buffer += '_ ';
                                    }
                                    return (
                                        <li key={i}>
                                            <span>{buffer}</span>
                                        </li>
                                    );
                                })}
                        </ol>
                    </div>
                    <div className="col-6 shaded-box">
                        <h3>Definitions</h3>
                        <ol>
                            {
                                this.state.targetWordDefs.map((def, i) => {
                                    if (def === '') {
                                        return (
                                            <li key={i}>
                                                <span>N/A</span>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li key={i}>
                                            <span>{def}</span>
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
                                placeholder="Type here"
                                onChange={this.handleChange} value={this.state.userInput} />
                            <button className="btn btn-outline-dark mx-2"
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
};
