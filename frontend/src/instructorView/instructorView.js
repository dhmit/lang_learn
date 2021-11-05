import React, {useState} from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import { getCookie } from '../common';
import {TestExcerciseModal} from "./TestExcercise";
import {InstructorViewContext} from "../contexts/InstructorViewContextProvider";


export class InstructorView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            textData: null,
            showModal: showModal,
            setShowModal : setShowModal,
            resourceAmount: 0,
            setResourceAmount : setResourceAmount,
            addTitle: '',
            addContent: '',
        };
        this.modalHandler = this.modalHandler.bind(this);
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

    modalHandler = (event) => {
        event.preventDefault();
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    render() {
        if (!this.state.textData) {
            return (<LoadingPage text='Setting up Teacher Interface...'/>);
        }
        return (<React.Fragment>
            <Navbar color='light' />
            <div className="page instructor">
                <h1 className='instructor-header'>Resources</h1>
                {
                    this.state.resourceAmount > 0
                    && <div
                        className="alert"
                        style={{ background: 'rgba(39, 142, 115, 0.6)', color: 'white' }}
                        role="alert"
                    >
                        Currently adding {this.state.resourceAmount} text(s)! (Do
                            not close this page.)
                    </div>
                }
                <button className='add-text-button' onClick={this.modalHandler}>
                    <div className='plus-icon'>
                        <div className="plus-1" />
                        <div className="plus-2"/>
                    </div>
                    Add Text
                </button>
                <InstructorViewContext.Provider>
                {({showModal, setShowModal, resourceAmount, setResourceAmount}) => (
                    <TestExcerciseModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        resourceAmount={resourceAmount}
                        setResourceAmount={setResourceAmount}
                    />
                  )}
                </InstructorViewContext.Provider>
            <Footer />
            </div>
        </React.Fragment>);
    }
}
