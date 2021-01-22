import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer } from '../UILibrary/components';

export class AnagramView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // async componentDidMount() {
    //     try {
    //         const response = await fetch('/api/ENDPOINT/');
    //         const data = await response.json();
    //         this.setState({data});
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

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
