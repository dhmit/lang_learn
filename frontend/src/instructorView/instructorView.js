import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

export class InstructorView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textData: null,
        };
    }

    async componentDidMount() {
        try {
            const apiURL = '/api/all_text';
            const response = await fetch(apiURL);
            const data = await response.json();
            this.setState({
                textData: data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.textData) {
            return (<LoadingPage text='Setting up Teacher Interface...'/>);
        }
        return (<React.Fragment>
            <Navbar color='light' />
            <div className="page instructor">
                <div className="row">
                    <h1>Resources</h1>
                </div>
                {
                    this.state.textData.map((text, i) => (
                        <div className="card" key={i}>
                            <div className="card-header">
                                <div className="row">
                                    <div className="col text-title">
                                        {text['title']}
                                    </div>
                                    <div className="col text-right title-collapse">
                                        Show More
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col text-content">
                                        {text['text']}
                                    </div>
                                    <div className="col">
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <Footer />
        </React.Fragment>);
    }
}
