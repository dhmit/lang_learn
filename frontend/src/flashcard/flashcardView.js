import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ReactTooltipDefaultExport from 'react-tooltip';

import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export class FlashcardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: null,
            cardIndex: 0,
            starredCards: [],
        };
    }

    componentDidMount = async () => {
        const apiURL = `/api/get_flashcards/${this.props.textID}/${this.props.partOfSpeech}`;
        const response = await fetch(apiURL);
        const cardData = await response.json();
        this.setState({ cardData });
    }

    getCurrentCard = () => {
        return this.state.cardData[this.state.cardIndex];
    }

    changeCard = (delta) => {
        this.setState({
            cardIndex: (this.state.cardIndex + delta) % this.state.cardData.length,
        });
    }

    render() {
        if (!this.state.cardData) {
            return (<LoadingPage text='Creating Flashcards...'/>);
        }
        const card = this.getCurrentCard();
        console.log(card);
        return (
            <>
                <Navbar/>
                <div className='page'>
                    <div className='row'>
                        <div className='col-9'>
                            <h1 className='flashcard-title'>Flashcard</h1>
                            <button
                                className="btn btn-outline-light btn-circle flashcard-instruction"
                                data-tip
                                data-for="anagram-rules"
                            >
                                <b>?</b>
                            </button>
                            <ReactTooltipDefaultExport
                                id="anagram-rules"
                                place="right"
                                style= {{ 'fontSize': '25px' }}
                            >
                                <h3> Instructions </h3>
                                Put some flashcard instructions here.
                            </ReactTooltipDefaultExport>
                        </div>
                        <div className='col-3'>
                            Progress
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-9'>
                            <h2 className='flashcard-category'>
                                Category: {capitalize(this.props.partOfSpeech) + 's'}
                            </h2>
                        </div>
                        <div className='col-3'>
                            Starred Words Only:
                        </div>
                    </div>
                    <div className='flashcard-div'>
                        <div className='flashcard-arrows' onClick={() => this.changeCard(-1)}>
                            &#60;
                        </div>
                        <div className='flashcard'>
                            <h1 className='flashcard-word'>{card.word.toUpperCase()}</h1>
                            <h2 className='flashcard-info'>
                                <b><u>Definition:</u></b> {card.definition[0]}
                            </h2>
                            <h2 className='flashcard-info'>
                                <b><u>Example:</u></b> {card.example[0]}
                            </h2>
                        </div>
                        <div className='flashcard-arrows' onClick={() => this.changeCard(1)}>
                            &#62;
                        </div>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }
}
FlashcardView.propTypes = {
    textID: PropTypes.number,
    partOfSpeech: PropTypes.string,
};
