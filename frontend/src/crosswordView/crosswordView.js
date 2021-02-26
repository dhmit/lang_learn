import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

export class CrosswordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crosswordData: null,
        };
    }

    componentDidMount = async () => {
        try {
            const apiURL = `/api/get_crossword/${this.props.textID}/${this.props.partOfSpeech}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            this.setState({
                crosswordData: data,
            });
            this.startTimer();
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <>
                <Navbar/>
                CROSSWORD
                <Footer/>
            </>
        );
    }
}
CrosswordView.propTypes = {
    textID: PropTypes.number,
    partOfSpeech: PropTypes.string,
};
