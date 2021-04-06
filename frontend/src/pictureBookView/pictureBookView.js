import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import { getCookie } from '../common';

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export class PictureBookView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureData: null,
            showModal: false,
            pictureBookStory: '',
            pictureBookWords: null,
            submitted: false,
        };
        this.modalHandler = this.modalHandler.bind(this);
    }

    componentDidMount = async () => {
        const apiURL = `/api/get_picturebook_prompt/${this.props.textID}/`
            + `${this.props.partOfSpeech}`;
        const response = await fetch(apiURL);
        const pictureData = await response.json();
        this.setState({ pictureData });
        document.addEventListener('keydown', this.handleKeyDown, true);
    }

    createPictureBook = async (input) => {
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/get_picturebook_data?content=' + input;
            const response = await fetch(apiURL);

            const pictureBookWords = await response.json();
            pictureBookWords.pop(-1);
            this.setState({ pictureBookWords });
        } catch (e) {
            console.log(e);
        }
    }

    modalHandler = (event) => {
        event.preventDefault();
        this.setState((prevState) => ({
            showModal: !prevState.showModal,
        }));
    }

    handleInput = (event) => {
        const inputValue = event.target.value;
        this.setState({
            pictureBookStory: inputValue,
        });
        if (';,. '.includes(inputValue.slice(-1))) {
            this.createPictureBook(inputValue);
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ submitted: true });
        this.createPictureBook();
    }

    render() {
        if (!this.state.pictureData) {
            return (<LoadingPage text='Creating story generator...'/>);
        }
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <div className='row'>
                    <div className='col-xl-8 text-left'>
                        <h1 className='flashcard-title'>Story Generator</h1>
                        <button
                            className="btn btn-outline-light btn-circle flashcard-instruction"
                            onClick={this.modalHandler}>
                            <b>?</b>
                        </button>
                        <h2 className='flashcard-category'>
                            Category: {capitalize(this.props.partOfSpeech) + 's'}
                        </h2>
                    </div>
                    <div>
                        {
                            this.state.showModal
                            && <div className="backdrop" onClick={this.modalHandler}></div>
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
                                <p>Welcome to the Storybook Generator! At the top of the page,
                                you will see some pictures related to nouns from the story you read.
                                In the textbox below, use these nouns to write a story
                                of your own! Feel free to also make use of the suggested words. As
                                you type, the generator finds images matching the words you use and
                                you will see them come up as a storybook under the textbox. When you
                                finish writing and click submit, your story will be checked for
                                grammar correctness and you will be able to see your completed story
                                in picturebook form!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    onClick={this.modalHandler}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 text-right bottom-align-text' id="submit-btn-div">
                        {(this.state.submitted)
                            ? <button type="submit"
                                className="btn btn-success submit-btn"
                                form="picturebook-form"
                                disabled={true}>
                                Submit
                            </button>
                            : <button type="submit"
                                className="btn btn-success submit-btn"
                                form="picturebook-form"
                                onClick={this.handleSubmit}>
                                Submit
                            </button>
                        }

                    </div>
                </div>
                <div className="row box">
                    {
                        this.state.pictureData
                            ? this.state.pictureData.map((word, i) => (
                                <div key={i} className="col-3 text-center">
                                    <img className="picture-prompt"
                                        src={word['url']} alt={word['word']}/>
                                    <h5>{word['word']}</h5>
                                </div>
                            ))
                            : null
                    }
                </div>
                <div className='row'>
                    <div className="col box">
                        <form>
                            <div className="form-group">
                                <label>Please write a story based on the images above.
                                    Make sure to use the given words.</label>
                                {(this.state.submitted)
                                    ? <textarea className="form-control story-text-input"
                                        id="content"
                                        rows="10"
                                        value={this.pictureBookStory}
                                        disabled={true}>
                                    </textarea>
                                    : <textarea className="form-control story-text-input"
                                        id="content"
                                        rows="10"
                                        onChange={this.handleInput}
                                        value={this.pictureBookStory}>
                                    </textarea>
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className='row'>
                    {
                        this.state.pictureBookWords
                            ? this.state.pictureBookWords.map((word, i) => (
                                <div key={i} className="col-3 text-center">
                                    <img className="picture-prompt"
                                        src={word['url']} alt={word['word']}/>
                                    <h5>{word['word']}</h5>
                                </div>
                            ))
                            : null
                    }
                </div>
            </div>
            <Footer />
        </React.Fragment>);
    }
}
PictureBookView.propTypes = {
    textID: PropTypes.number,
    partOfSpeech: PropTypes.string,
};
