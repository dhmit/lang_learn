import React from 'react';
import './speechToTextView.scss';
import * as PropTypes from 'prop-types';
import {Footer, Navbar} from "../UILibrary/components";

export class SpeechToTextView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {

    }

    render() {
        return (<>
            <Navbar />
            <div className="page">
                Hello World!
            </div>
            <Footer />
        </>);
    }
}

export default SpeechToTextView;


