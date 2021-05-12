import React from 'react';
import * as PropTypes from 'prop-types';

import { ReactMic } from 'react-mic';
import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

export class SpeechToTextView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sentences: [],
            sentenceIndex: 0,
            record: false,
            blob: null,
            blobURL: null,
            transcribedData: null,
        };
    }

    onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    onSave = (blobObject) => {
        this.setState({ downloadLinkURL: blobObject });
    }

    onStop = (recordedBlob) => {
        this.setState({
            blob: recordedBlob.blob,
            blobURL: recordedBlob.blobURL,
        });
        this.getTranscript();
    }

    startRecording = () => {
        this.setState({ record: true });
    }

    stopRecording = () => {
        this.setState({ record: false });
    }

    async getTranscript() {
        try {
            const fd = new FormData();
            fd.append('audio', this.state.blob);
            const apiURL = '/api/get_transcript';
            const response = await fetch(apiURL, {
                headers: { Accept: 'application/json' },
                method: 'POST',
                body: fd,
            });
            const transcribedData = await response.json();
            this.setState({ transcribedData: transcribedData });
            console.log(transcribedData);
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidMount() {
        try {
            const apiURL = `/api/get_text_sentences/${this.props.textID}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            console.log(data);
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
            return (<LoadingPage text='Setting up Speech to Text'/>);
        }

        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <ReactMic
                    record={record}
                    className="sound-wave"
                    onStop={this.onStop}
                    onData={this.onData}
                    strokeColor="#000000"
                    backgroundColor="#FF4081"
                />
                <br/>
                <button onClick={this.startRecording} type="button">Start</button>
                <button onClick={this.stopRecording} type="button">Stop</button>
                <br/>
                <audio
                    controls="controls"
                    src={blobURL}
                    controlsList="nodownload"
                />
                <p>Transcript: {transcribedData ? transcribedData[0]['transcript'] : ''}</p>
            </div>
            <Footer />
        </React.Fragment>);
    }
}

SpeechToTextView.propTypes = {
    textID: PropTypes.number,
};
