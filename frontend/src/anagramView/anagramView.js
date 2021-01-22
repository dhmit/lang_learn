import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer } from '../UILibrary/components';

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
    }

    async componentDidMount() {
        try {
            const apiURL = `/api/get_anagram/${this.props.textID}/noun`;
            const response = await fetch(apiURL);
            const data = await response.json();
            const targetWords = [];
            const letters = [];
            const targetWordDefs = [];
            for (let i = 0; i < (data['word_data']).length; i++) {
                const word = data['word_data'][i];
                targetWords.push(word['word_data']);
                targetWordDefs.push(word['definition']);
            }
            for (let i = 0; i < (data['letters']).length; i++) {
                letters.push(data['letters'][i].toUpperCase());
            }

            const extraWordsSet = new Set(data['extra_words']);
            this.setState({
                targetWordDefs: data['word_data'],
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
                <div>
                    Score: {this.state.score}
                </div>
                <div className="row">
                    <div className="col-3" >
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
                    <div className="col-3">
                        <h3>Words Found</h3>
                        <ul>
                            {
                                this.state.targetWords.map((word, i) => {
                                    if (this.state.targetWordsFound.includes(word)) {
                                        return (
                                            <li key={i}>
                                                {word}
                                            </li>
                                        );
                                    }
                                    let buffer = '';
                                    for (let j = 0; j < word.length; j++) {
                                        buffer += '_ ';
                                    }
                                    return (
                                      <li key={i}>
                                          {buffer}
                                      </li>
                                    );
                            })}
                        </ul>
                    </div>
                    <div className="col-6">
                        <h3>Definitions</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3" >
                    </div>
                    <div className="col-9">
                        {this.state.letters}
                    </div>
                </div>
                <div className="row">
                    <div className="col-3" >
                    </div>
                    <div className="col-9">
                        <form onSubmit={this.handleSubmit}>
                            <input className="formControl" type="text" name="userInput"
                                onChange={this.handleChange} value={this.state.userInput} />
                            <button className="btn btn-outline-dark" type="submit">Enter</button>
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
