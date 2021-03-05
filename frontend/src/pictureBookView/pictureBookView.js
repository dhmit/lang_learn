import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export class PictureBookView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureData: null,
            showModal: false,
        };
        this.modalHandler = this.modalHandler.bind(this);
    }

    componentDidMount = async () => {
        const apiURL = `/api/get_picturebook_prompt/${this.props.textID}/${this.props.partOfSpeech}`;
        const response = await fetch(apiURL);
        const pictureData = await response.json();
        this.setState({ pictureData });
        document.addEventListener('keydown', this.handleKeyDown, true);
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
                    <div className='col-xl-8 col-md-6 col-12 text-center text-md-left'>
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
                                <p></p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    onClick={this.modalHandler}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row-2'>
                    <form>
                        <div className="form-group">
                            <label>Please write a story based on the images above. Make sure to use the given words.</label>
                            <input type="text" className="form-control" id="exampleInputPassword1"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                      </form>
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
