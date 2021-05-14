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
        };
        this.getTranscript = this.getTranscript.bind(this);
        this.nextSentence = this.nextSentence.bind(this);
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
        if (this.state.sentenceIndex === this.state.sentences.length - 1) {
            this.setState({ sentenceIndex: 0 });
        } else {
            this.setState((prevState) => {
                return { sentenceIndex: prevState.sentenceIndex + 1 };
            });
        }
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
                transcribedData: transcribedData,
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
                    <h1>
                        Speech to Text
                    </h1>
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
                        <button className="btn btn-success btn-done" onClick={this.getTranscript} disabled={!this.state.canTranscribe}>
                            Done
                        </button>
                    </div>
                    <div className="col-2 vertical-center">
                        <button className="btn btn-outline-light" onClick={this.nextSentence}>
                            Next Sentence
                        </button>
                    </div>
                </div>
<<<<<<< Updated upstream
                <p>Transcript: {transcribedData ? transcribedData[0]['transcript'] : ''}</p>
                <p>Score: {transcribedData ? transcribedData[0]['score'] : ''}</p>
=======
                <p>Transcript:
                    <div className="spinner-grow spinner-grow-sm mx-2" role="status" hidden={!this.state.transcribing}>
                        <span className="sr-only">Loading...</span>
                    </div>
                    {transcribedData ? transcribedData[0]['transcript'] : ''}
                </p>
>>>>>>> Stashed changes
            </div>
            <Footer />
        </React.Fragment>);
    }
}

SpeechToTextView.propTypes = {
    textID: PropTypes.number,
};
