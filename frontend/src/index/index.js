import React from 'react';
// import * as PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Navbar, Footer } from '../UILibrary/components';

export class IndexView extends React.Component {
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
        if (!this.state.data) {
            return (<>
                Hello, world! There is no application here yet.
                <Button href="/anagram" variant="outline-primary">Anagram</Button>
            </>);
        }

        return (<React.Fragment>
            <Navbar />
            <div className="page">
            </div>
            <Footer />
        </React.Fragment>);
    }
}
export default IndexView;
