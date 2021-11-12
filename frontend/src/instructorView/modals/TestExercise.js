import React, { useContext, useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import { LoadingPage } from '../../UILibrary/components';
import { capitalize, getCookie } from '../../common';
import { InstructorViewContext } from '../../contexts/InstructorViewContext';

class Module extends React.Component {
    render() {
        const { moduleInfo, moduleName } = this.props;
        return (
            <div className='col-md-4 col-6'>
                <h2 className='module-header'>
                    {
                        moduleName === 'picturebook'
                            ? 'Story Generator'
                            : capitalize(moduleName)}
                </h2>
                {
                    Object.keys(moduleInfo).map((category, k) => (
                        <div className='module-category' key={k}>
                            <input
                                className='module-category-checkbox'
                                type='checkbox'
                                name={category}
                                checked={moduleInfo[category]}
                                onChange={() => {
                                    this.props.updateModule(
                                        moduleName,
                                        category,
                                        !moduleInfo[category],
                                    );
                                }}
                            />
                            <label className='module-category-label'>
                                {capitalize(category)}
                            </label>
                        </div>
                    ))
                }
            </div>
        );
    }
}
Module.propTypes = {
    moduleName: PropTypes.string,
    moduleInfo: PropTypes.object,
    updateModule: PropTypes.func,
};

class TextInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: true,
            editing: false,
            textData: this.props.text,
        };
    }

    updateModule = (module, category, value) => {
        const textData = this.state.textData;
        textData.modules[module][category] = value;
        this.setState({ textData });
    }

    // TODO: Find a way to display feedback upon saving or deleting a text.
    saveText = async () => {
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/update_text';
            this.setState({ editing: true });
            await fetch(apiURL, {
                credentials: 'include',
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(this.state.textData),
            });
            this.setState({ editing: false });
        } catch (e) {
            console.log(e);
        }
    }

    deleteText = () => {
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/delete_text';
            fetch(apiURL, {
                credentials: 'include',
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(this.state.textData.id),
            }).then(() => {
                this.props.delete();
            });
        } catch (e) {
            console.log(e);
        }
    }

    toggleCollapse = () => {
        this.setState({ collapse: !this.state.collapse });
    }

    editText = (e) => {
        const { textData } = this.state;
        textData.content = e.target.value;
        this.setState({ textData });
    }

    editTitle = (e) => {
        const { textData } = this.state;
        textData.title = e.target.value;
        this.setState({ textData });
    }

    render() {
        const { textData, collapse, editing } = this.state;
        const { modules, content, title } = textData;

        return (
            <div className="card">
                <div className={`card-header ${collapse ? 'header-round' : ''}`}>
                    <div className="row">
                        <div className="col">
                            <input
                                className='text-title'
                                type='text'
                                name='title'
                                onChange={this.editTitle}
                                value={title}
                            />
                        </div>
                        <div
                            onClick={this.toggleCollapse}
                            className="col text-right collapse-div"
                        >
                            <label className='title-collapse'>
                                {collapse ? 'Show More' : 'Show Less'}
                            </label>
                            <div className={`collapse-arrow ${collapse ? '' : 'arrow-flip'}`}>
                                <div className='rect-1'/>
                                <div className='rect-2'/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`card-body ${collapse ? 'card-collapse' : 'card-expand'}`}>
                    <div className="row">
                        <div className="col-xl-5 col-12 mb-4 mb-xl-0">
                            <textarea
                                className="text-content"
                                value={content}
                                onChange={this.editText}
                            />
                        </div>
                        <div className="col-xl-7 col-12 module-selection">
                            <div className="row">
                                {
                                    Object.keys(modules).map((module, k) => (
                                        <Module
                                            key={k}
                                            moduleName={module}
                                            moduleInfo={modules[module]}
                                            updateModule={this.updateModule}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="card-button-div">
                        <button
                            onClick={this.saveText}
                            className={`card-buttons save-button ${editing ? 'disabled' : ''}`}
                            disabled={editing}
                        >
                            Save
                        </button>
                        <button
                            onClick={this.deleteText}
                            className={`card-buttons delete-button ${editing ? 'disabled' : ''}`}
                            disabled={editing}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
TextInfo.propTypes = {
    text: PropTypes.object,
    delete: PropTypes.func,
};

export default function TestExcerciseModal() {
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

    const deleteText = (id) => {
        const textData = stateTextData.filter((t) => t.id !== id);
        setTextData(textData);
    };

    const modalHandler = (event) => {
        event.preventDefault();
        state.setShowModal(!state.showModal);
    };

    const handleInput = (event) => {
        if (event.target.id === 'title') {
            setTitle(event.target.value);
        } else {
            setContent(event.target.value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/add_text';
            setTitle('');
            setContent('');
            state.setResourceAmount(state.resourceAmount + 1);
            modalHandler(event);

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
        } catch (e) {
            console.log(e);
        }
    };
    if (!stateTextData) {
        return (<LoadingPage text='Setting up Teacher Interface...'/>);
    }
    return (<React.Fragment>
        <div className="page instructor">
            <div>
                {
                    state.showModal
                        ? <div className="backdrop" onClick={modalHandler}>
                        </div>
                        : null
                }
                <div className="Modal modal-content" style={{
                    transform: state.showModal
                        ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: state.showModal ? 1 : 0,
                }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Create Resource</h5>
                        <button type="button" className="close" onClick={modalHandler}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                onClick={modalHandler}>Cancel</button>
                            <button type="submit" className="btn btn-success btn-create">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {
                stateTextData.map((t) => (
                    <TextInfo
                        key={t.id}
                        text={t}
                        delete={() => deleteText(t.id)}
                    />
                ))
            }
        </div>
    </React.Fragment>);
}
