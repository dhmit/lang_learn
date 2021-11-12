import React, { useContext, useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import { LoadingPage } from '../../UILibrary/components';
import { getCookie } from '../../common';
import { InstructorViewContext } from '../../contexts/InstructorViewContext';
import ExerciseType from '../ExerciseTypes';

export default function TextExerciseModal() {
    const state = useContext(InstructorViewContext);
    const [stateTextData, setTextData] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    //     this.modalHandler = this.modalHandler.bind(this);
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

    const modalHandler = (exerciseType, event) => {
        console.log('event in text exercise ', event);
        event.preventDefault();
        state.setShowModal(exerciseType);
        console.log('exercise Type ', exerciseType);
    };


    const handleInput = (event) => {
        if (event.target.id === 'title') {
            setTitle(event.target.value);
        } else {
            setContent(event.target.value);
        }
    };

    const handleSubmit = async (exerciseType, event) => {
        console.log('handle submit ', exerciseType);
        event.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/add_text';
            setTitle('');
            setContent('');
            state.setResourceAmount(state.resourceAmount + 1);
            modalHandler(exerciseType, event);

            const response = await fetch(apiURL, {
                credentials: 'include',
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            const newText = await response.json();
            const currentText = stateTextData;
            currentText.push(newText);
            setTextData(currentText);
            state.setResourceAmount(state.resourceAmount - 1);
            console.log('state resource amount: ', state.resourceAmount);
        } catch (e) {
            console.log(e);
        }
    };
    if (!stateTextData) {
        return (<LoadingPage text='Setting up Teacher Interface...'/>);
    }
    return (<React.Fragment>
        <div className="page instructor">
            <div className="modal-header">
                <h5 className="modal-title">Create Resource</h5>
                <button type="button" className="close"
                        onClick={(e) => modalHandler(ExerciseType.NONE, e)}>
                    <span>&times;</span>
                </button>
            </div>
            <form onSubmit={(e) => handleSubmit(ExerciseType.NONE, e)}>
                <div className="modal-body">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <label htmlFor="title" className="form-label">Title:</label>
                        </div>
                        <div className="col-auto">
                            <input type="text" id="title"
                                className="form-control" onChange={handleInput}
                                value={title} required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="form-label">Content:</label>
                        <textarea className="form-control" id="content"
                            rows="7" onChange={handleInput}
                            value={content} required>
                        </textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger"
                        onClick={(e) => modalHandler(ExerciseType.NONE, e)}
                    >Cancel</button>
                    <button type="submit" className="btn btn-success btn-create">
                        Create
                    </button>
                </div>
            </form>
        </div>
    </React.Fragment>);
}
