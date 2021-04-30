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
            blobURL: null,
            downloadLinkURL: null,
        };
    }

    onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    onSave = (blobObject) => {
        this.setState({ downloadLinkURL: blobObject.blobURL });
    }

    onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        this.setState({ blobURL: recordedBlob.blobURL });
    }

    startRecording = () => {
        this.setState({ record: true });
    }

    stopRecording = () => {
        this.setState({ record: false });
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
            downloadLinkURL,
            record,
        } = this.state;

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
            </div>
            <Footer />
        </React.Fragment>);
    }
}

SpeechToTextView.propTypes = {
    textID: PropTypes.number,
};
