import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

export class FlashcardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: null,
        };
    }

    componentDidMount = async () => {
        const apiURL = `/api/get_flashcards/${this.props.textID}/${this.props.partOfSpeech}`;
        const response = await fetch(apiURL);
        const cardData = await response.json();
        this.setState({ cardData });
    }

    render() {
        if (!this.state.cardData) {
            return (<LoadingPage text='Creating Flashcards...'/>);
        }
        return (
            <>
                <Navbar/>
                <div className='page'>
                    <div>
                        Flashcard ? Progress
                    </div>
                    <div>
                        Category:
                    </div>
                    <div>
                        Card here
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
