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
        };
    }

    startRecording = () => {
        this.setState({ record: true });
    }

    stopRecording = () => {
        this.setState({ record: false });
    }

    onData(recordedBlob) {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    onStop(recordedBlob) {
        console.log('recordedBlob is: ', recordedBlob);
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
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <ReactMic
                    record={this.state.record}
                    className="sound-wave"
                    onStop={this.onStop}
                    onData={this.onData}
                    strokeColor="#000000"
                    backgroundColor="#FF4081"
                />
                <button onClick={this.startRecording} type="button">Start</button>
                <button onClick={this.stopRecording} type="button">Stop</button>
            </div>
            <Footer />
        </React.Fragment>);
    }
}

SpeechToTextView.propTypes = {
    textID: PropTypes.number,
};
