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
                <h2>Anagrams</h2>
                <div className="row">
                    <div className="col-3" >
                        <h3>Extra Words</h3>
                    </div>
                    <div className="col-3">
                        <h3>Words Found</h3>
                    </div>
                    <div className="col-6">
                        <h3>Definitions</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3" >
                    </div>
                    <div className="col-9">
                        <p>Letters will go here</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3" >
                    </div>
                    <div className="col-9">
                        <p>Typing word and submit button go here</p>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>);
    }
}
AnagramView.propTypes = {
    textID: PropTypes.number,
};
