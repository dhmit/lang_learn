import React from 'react';
import * as PropTypes from 'prop-types';

import { ReactMic } from 'react-mic';
import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

export class SpeechToTextView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sentences: null,
            sentenceIndex: 0,
            record: false,
            blob: null,
            blobURL: null,
            transcribedData: null,
            canTranscribe: false,
            transcribing: false,
            showModal: false,
        };
        this.getTranscript = this.getTranscript.bind(this);
        this.nextSentence = this.nextSentence.bind(this);
        this.modalHandler = this.modalHandler.bind(this);
    }

    onStop = (recordedBlob) => {
        this.setState({
            blob: recordedBlob.blob,
            blobURL: recordedBlob.blobURL,
        });
    }

    startRecording = () => {
        this.setState({
            record: true,
            canTranscribe: false,
        });
    }

    stopRecording = () => {
        this.setState({
            record: false,
            canTranscribe: true,
        });
    }

    nextSentence = () => {
        this.setState({
            transcribedData: null,
        });
        if (this.state.sentenceIndex === this.state.sentences.length - 1) {
            this.setState({ sentenceIndex: 0 });
        } else {
            this.setState((prevState) => {
                return { sentenceIndex: prevState.sentenceIndex + 1 };
            });
        }
    }

    modalHandler = (event) => {
        event.preventDefault();
        this.setState((prevState) => ({
            showModal: !prevState.showModal,
        }));
    }

    async getTranscript() {
        try {
            this.setState({
                canTranscribe: false,
                transcribing: true,
            });
            const fd = new FormData();
            fd.append('audio', this.state.blob);
            fd.append('sentence', this.state.sentences[this.state.sentenceIndex]['sentence']);
            const apiURL = '/api/get_transcript';
            const response = await fetch(apiURL, {
                headers: { Accept: 'application/json' },
                method: 'POST',
                body: fd,
            });
            const transcribedData = await response.json();
            this.setState({
                transcribedData: transcribedData[0],
                transcribing: false,
            });
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidMount() {
        try {
            const apiURL = `/api/get_text_sentences/${this.props.textID}`;
            const response = await fetch(apiURL);
            const sentences = await response.json();
            this.setState({ sentences: sentences });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {
            blobURL,
            record,
            transcribedData,
        } = this.state;
        if (!this.state.sentences) {
            return (<LoadingPage loadingText='Setting up Speech to Text'/>);
        }
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <div className="row">
                    <h1>Speech to Text</h1>
                    <button className="btn btn-outline-light btn-circle mx-3 btn-instructions"
                        onClick={this.modalHandler}>
                        <b>?</b>
                    </button>
                </div>
                <div>
                    {
                        this.state.showModal
                        && <div className="backdrop" onClick={this.modalHandler}></div>
                    }
                    <div className={`Modal modal-content ${this.state.showModal
                        ? 'modal-show' : 'modal-hide'}`}>
                        <div className="modal-header">
                            <h5 className="modal-title">Instructions</h5>
                            <button type="button" className="close"
                                disabled={!this.state.showModal}
                                onClick={this.modalHandler}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Welcome to the Speech to Text Module! The goal of the
                            module is to read alout the sentence that has been extracted
                            from the text. Press the start button to start recording and
                            the stop button when you are done. </p>
                            <p> If you are happy with your audio, press the Done button
                            to receive your score for the sentence. Once you are satisfied
                            with you score, feel free to move on to the next sentence
                            by pressing the Next Sentence button.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                onClick={this.modalHandler}>Close</button>
                        </div>
                    </div>
                </div>
                <div>
                    <h3>Please read this sentence: </h3>
                </div>
                <div className="row shaded-box justify-content-center">
                    <p className="vertical-center">
                        {this.state.sentences[this.state.sentenceIndex]['sentence']}
                    </p>
                </div>
                <div className="row shaded-box">
                    <div className="col-2 vertical-center">
                        <button className="btn btn-outline-light mx-2"
                            onClick={this.startRecording}>Start</button>
                        <button className="btn btn-outline-light"
                            onClick={this.stopRecording}>Stop</button>
                    </div>
                    <div className="col">
                        <ReactMic
                            record={record}
                            className="sound-wave"
                            onStop={this.onStop}
                            onData={this.onData}
                            strokeColor="#000000"
                            backgroundColor="#FFFFFF"
                        />
                    </div>
                    <div className="col">
                        <audio
                            controls="controls"
                            src={blobURL}
                            controlsList="nodownload"
                        />
                    </div>
                    <div className="col-1 vertical-center">
                        <button className="btn btn-success btn-done"
                            onClick={this.getTranscript}
                            disabled={!this.state.canTranscribe}>
                            Done
                        </button>
                    </div>
                    <div className="col-2 vertical-center">
                        <button className="btn btn-outline-light" onClick={this.nextSentence}>
                            Next Sentence
                        </button>
                    </div>
                </div>
                <span hidden={!this.state.transcribing}>Processing Audio
                    <div className="spinner-grow spinner-grow-sm mx-2"
                        role="status" hidden={!this.state.transcribing}>
                        <span className="sr-only">Processing Audio...</span>
                    </div>
                </span>
                {
                    transcribedData
                        ? <div>
                            <p>Transcript: {transcribedData['transcript']}</p>
                            <p>Score: {transcribedData['score']}</p>
                        </div>
                        : null
                }
            </div>
            <Footer />
        </React.Fragment>);
    }
}

SpeechToTextView.propTypes = {
    textID: PropTypes.number,
};
