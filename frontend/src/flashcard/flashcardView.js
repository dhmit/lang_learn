import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

const filledStar = (size, color) => {
    return (
        <svg
            xmlns = "http://www.w3.org/2000/svg"
            width = {size}
            height = {size}
            fill = {color}
            className = "bi bi-star-fill"
            viewBox = "0 0 16 16"
        >
            <path
                d={'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173'
                + ' 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927'
                + ' 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83'
                + ' 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'}
            />
        </svg>
    );
};



const star = (size, color) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            className="bi bi-star"
            viewBox="0 0 16 16">
            <path
                d={'M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389'
                + ' 2.256c.386.198.824-.149.746-.592l-.83-4.73'
                + ' 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513'
                + ' 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83'
                + ' 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71'
                + ' 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525'
                + ' 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694'
                + ' 3.957-3.686-1.894a.503.503 0 0 0-.461 0z'}
            />
        </svg>
    );
};

export class FlashcardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: null,
            cardIndex: 0,
            starredCards: [],
            showBack: false,
            starOnly: false,
            showModal: false,
        };
        this.modalHandler = this.modalHandler.bind(this);
    }

    componentDidMount = async () => {
        const apiURL = `/api/get_flashcards/${this.props.textID}/${this.props.partOfSpeech}`;
        const response = await fetch(apiURL);
        const cardData = await response.json();
        this.setState({ cardData });
        document.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    getCurrentCard = () => {
        const {
            starOnly,
            starredCards,
            cardIndex,
            cardData,
        } = this.state;
        return starOnly
            ? cardData[starredCards[cardIndex]]
            : cardData[cardIndex];
    }

    changeCard = (delta) => {
        const { cardData, starredCards, cardIndex } = this.state;
        const listLength = this.state.starOnly ? starredCards.length : cardData.length;
        const newCardIndex = (cardIndex + delta + listLength) % listLength;
        this.setState({
            showBack: false,
            cardIndex: newCardIndex,
        });
    }

    flipCard = () => {
        this.setState({ showBack: !this.state.showBack });
    }

    isStarred = (cardIndex) => {
        const index = this.state.starredCards.indexOf(cardIndex);
        return index !== -1;
    }

    toggleStar = () => {
        const { starredCards, starOnly, cardIndex } = this.state;
        let currentIndex = starOnly ? starredCards[cardIndex] : cardIndex;
        if (this.isStarred(currentIndex)) {
            starredCards.splice(starredCards.indexOf(currentIndex), 1);
            if (starOnly) {
                if (starredCards.length > 0) {
                    currentIndex %= starredCards.length;
                } else {
                    currentIndex = 0;
                }
            }
        } else {
            starredCards.push(this.state.cardIndex);
        }
        this.setState({ starredCards, cardIndex: currentIndex });
    }

    toggleStarOnly = () => {
        this.setState({ cardIndex: 0, starOnly: !this.state.starOnly });
    }

    handleKeyDown = (e) => {
        if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
            const { code } = e;
            if (code === 'ArrowLeft') {
                this.changeCard(-1);
            } else if (code === 'ArrowRight') {
                this.changeCard(1);
            } else if (code === 'Space') {
                this.flipCard();
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
        const numStarred = this.state.starredCards.length;
        const numCards = this.state.cardData.length;
        const currentCard = this.state.cardIndex + 1;
        if (this.state.starOnly && numStarred !== 0) {
            return parseInt((currentCard / numStarred) * 100);
        }
        if (!this.state.starOnly && numCards !== 0) {
            return parseInt((currentCard / numCards) * 100);
        }
        return 0;
    }

    render() {
        const {
            cardData,
            showBack,
            cardIndex,
            starOnly,
            starredCards,
        } = this.state;

        if (!cardData) {
            return (<LoadingPage text='Creating Flashcards...'/>);
        }

        /* Generate Text On Top of Progress Bar */
        const cardLength = starOnly ? starredCards.length : cardData.length;
        const progressText = cardLength === 0
            ? 'No Words Available'
            : `${cardIndex + 1}/${cardLength} Words`;

        /* Generate Flashcard */
        const card = this.getCurrentCard();
        const flipcard = card
            ? (
                <div className="flashcard-div row">
                    <div
                        className="flashcard-arrows col-1 text-right"
                        onClick={() => this.changeCard(-1)}
                    >
                        &#60;
                    </div>
                    <div className={`flip-card col ${showBack ? 'showBack' : ''}`}>
                        <div
                            className="flip-card-inner">
                            <div className="flip-card-front">
                                <div className="row">
                                    <div className="col-1" onClick={this.flipCard}>
                                    </div>
                                    <div className="col text-center" onClick={this.flipCard}>
                                        A PICTURE OF {card.word.toUpperCase()}
                                    </div>
                                    <div className="col-1 mx-2">
                                        <div className="flashcard-star-front"
                                            onClick={this.toggleStar}>
                                            {this.isStarred(starOnly
                                                ? starredCards[cardIndex] : cardIndex)
                                                ? filledStar('50', 'yellow')
                                                : star('50', 'white')
                                            }
                                        </div>
                                        <div className="flashcard-star-buffer"
                                            onClick={this.flipCard}>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="click-to-flip" onClick={this.flipCard}>
                                    Click to flip
                                </h3>

                            </div>

                            <div className="flip-card-back">
                                <div className="row">
                                    <div className="col-1" onClick={this.flipCard}>
                                    </div>
                                    <div className="col text-center" onClick={this.flipCard}>
                                        <h1 className='flashcard-word'>
                                            {card.word.toUpperCase()}
                                        </h1>
                                        <h2 className="flashcard-info">
                                            <b><u>Definition:</u></b> {card.definition[0]}
                                        </h2>
                                        <h2 className="flashcard-info">
                                            <b><u>Example:</u></b> <i>"{card.example[0]}"</i>
                                        </h2>
                                    </div>
                                    <div className="col-1 mx-2">
                                        <div className="flashcard-star-back"
                                            onClick={this.toggleStar}>
                                            {this.isStarred(starOnly
                                                ? starredCards[cardIndex] : cardIndex)
                                                ? filledStar('50', 'yellow')
                                                : star('50', 'white')
                                            }
                                        </div>
                                        <div className="flashcard-star-buffer"
                                            onClick={this.flipCard}>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="click-to-flip" onClick={this.flipCard}>
                                    Click to flip
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="flashcard-arrows col-1" onClick={() => this.changeCard(1)}>
                        &#62;
                    </div>
                </div>)
            : <div className="flashcard-error">You do not have any starred cards</div>;

        /* Actual Return statement */
        return (
            <>
                <Navbar/>
                <div className='page' onKeyDown={this.handleKeyDown}>
                    <div className='row'>
                        <div className='col-9'>
                            <h1 className='flashcard-title'>Flashcard</h1>
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
                                    <p>Use the flashcards to memorize words and concepts. You can
                                    click the "Click to flip" button to see the other side of the
                                    card and use the arrows on the side to move between cards. You
                                    can also use the arrow keys and space keys to navigate through
                                    the cards.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"
                                        onClick={this.modalHandler}>Close</button>
                                </div>
                            </div>
                        </div>

                        <div className='col-3'>
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
                    <div className='row'>
                        <div className='col-9'>
                            <h4 className='flashcard-category'>
                                Category: {capitalize(this.props.partOfSpeech) + 's'}
                            </h4>
                        </div>
                        <div className='col-3 d-flex'>
                            <label className='toggle-label'>Starred Words Only:</label>
                            <div className="custom-control custom-switch">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customSwitch1"
                                    onChange={this.toggleStarOnly}
                                    checked={starOnly}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="customSwitch1"
                                />
                            </div>
                        </div>
                    </div>
                    {flipcard}
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
