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
            pictureBookData: null,
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

    createPictureBook = async () => {
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/get_picturebook_data';

            const response = await fetch(apiURL, {
                credentials: 'include',
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    content: this.state.pictureBookData,
                }),
            });

            const pictureBookImages = await response.json();
            console.log(pictureBookImages);
        } catch (e) {
            console.log(e);
        }
    }

    modalHandler = (event) => {
        event.preventDefault();
        this.setState({
            showModal: !this.state.showModal,
        });
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
                        <h4 className='flashcard-category'>
                            Category: {capitalize(this.props.partOfSpeech) + 's'}
                        </h4>
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
                                <p>Welcome to the Storybook Generator! At the top of the page,
                                you will see some pictures related to nouns from the story you read.
                                In the textbox below, use these nouns to write a story
                                of your own! Feel free to also make use of the suggested words.
                                When you finish writing and click submit, your story will be
                                checked for grammar correctness and you will be able to see
                                your story in picturebook form!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    onClick={this.modalHandler}>Close</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-4 text-right bottom-align-text'>
                        <button type="submit" className="btn btn-success submit-btn"
                            form="picturebook-form">
                            Submit
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-9 box">
                        <form>
                            <div className="form-group">
                                <label>Please write a story based on the images above.
                                    Make sure to use the given words.</label>
                                <textarea className="form-control story-text-input"
                                    id="content"
                                    rows="10">
                                </textarea>
                            </div>
                        </form>
                    </div>
                    <div className="col box">
                        <h4>Words Others Used:</h4>
                    </div>
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
