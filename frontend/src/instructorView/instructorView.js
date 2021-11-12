import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import TestExerciseModal from './modals/TestExercise';
import { InstructorViewContext } from '../contexts/InstructorViewContext';


export function InstructorView() {
    const [textData, setTextData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // used to keep track how many resources to be added
    const [resourceAmount, setResourceAmount] = useState(0);
    // this.modalHandler = this.modalHandler.bind(this);

    useEffect(() => {
        async function fetchData() {
            try {
                const apiURL = '/api/all_text';
                const response = await fetch(apiURL);
                const data = await response.json();
                setTextData(data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    const modalHandler = (event) => {
        event.preventDefault();
        setShowModal(!showModal);
    };
    if (!textData) {
        return (<LoadingPage text='Setting up Teacher Interface...'/>);
    }
    const contextState = {
        showModal,
        setShowModal,
        resourceAmount,
        setResourceAmount,
    };

    return (<React.Fragment>
        <Navbar color='light' />
        <div className='page instructor'>
            <h1 className='instructor-header'>Resources</h1>
            {
                resourceAmount > 0
                && <div
                    className="alert"
                    style={{ background: 'rgba(39, 142, 115, 0.6)', color: 'white' }}
                    role="alert"
                >
                    Currently adding {resourceAmount} text(s)! (Do
                        not close this page.)
                </div>
            }
            <button className='add-text-button' onClick={modalHandler}>
                <div className='plus-icon'>
                    <div className="plus-1" />
                    <div className="plus-2"/>
                </div>
                Add Text
            </button>
            <InstructorViewContext.Provider value={contextState}>
                <TestExerciseModal/>
            </InstructorViewContext.Provider>
            <Footer />
        </div>
    </React.Fragment>);
}

InstructorView.propTypes = {
    showModal: PropTypes.bool,
    setShowModal: PropTypes.func,
    setResourceAmount: PropTypes.func,
    resourceAmount: PropTypes.number,
};
