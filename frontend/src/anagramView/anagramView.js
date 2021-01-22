import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer } from '../UILibrary/components';

export class AnagramView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordData: null,
            extraWords: null,
        };
    }

    async componentDidMount() {
        try {
            const apiURL = `/api/get_anagram/${this.props.textID}/noun`;
            const response = await fetch(apiURL);
            const data = await response.json();
            this.setState({
                wordData: data['word_data'],
                extraWords: data['extra_words'],
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        // if (!this.state.data) {
        //     return (<>
        //         Hello, world! There is no application here yet.
        //     </>);
        // }

        return (<React.Fragment>
            <Navbar />
            <div className="page">
            </div>
            <Footer />
        </React.Fragment>);
    }
}
AnagramView.propTypes = {
    textID: PropTypes.number,
};
