import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

export class PictureBookView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureData: null,
        };
    }

    render() {
        if (!this.state.wordData) {
            return (<LoadingPage text='Creating story generator...'/>);
        }
        return (<React.Fragment>
            <Navbar />
            <div className="page">
            </div>
            <Footer />
        </React.Fragment>);
    }
}
