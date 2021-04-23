import React from 'react';
import * as PropTypes from 'prop-types';
import { Footer, Navbar, LoadingPage } from '../UILibrary/components';

export class SpeechToTextView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {
        console.log('Hi');
    }

    render() {
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                Hello World!
            </div>
            <Footer />
        </React.Fragment>);
    }
}

SpeechToTextView.propTypes = {
    textID: PropTypes.number,
};
