import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import { capitalize } from '../common';

class Module extends React.Component {
    render() {
        const { moduleInfo, moduleName } = this.props;
        return (
            <div className='col-4'>
                <h2 className='module-header'>{capitalize(moduleName)}</h2>
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
        /* TODO: Handle checkbox state here so that we can submit all the info here as well */
        const { text } = this.props;
        this.state = {
            collapse: true,
            textData: {
                id: text.id,
                title: text.title,
                text: text.text,
                modules: {
                    anagrams: {
                        noun: false,
                        verb: false,
                        adjective: false,
                        adverb: false,
                    },
                    flashcards: {
                        noun: false,
                        verb: false,
                        adjective: false,
                        adverb: false,
                    },
                    quiz: {
                        conjugations: false,
                    },
                },
            },
        };
    }

    updateModule = (module, category, value) => {
        const textData = this.state.textData;
        textData.modules[module][category] = value;
        this.setState({ textData });
    }

    saveText = () => {
        /* Code for saving text to database */
        console.log('SAVING TEXT');
    }

    deleteText = () => {
        /* Code for deleting text */
        console.log('DELETING TEXT');
    }

    toggleCollapse = () => {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        const { textData, collapse } = this.state;
        const { modules, text, title } = textData;

        return (
            <div className="card">
                <div className={`card-header ${collapse ? 'header-round' : ''}`}>
                    <div className="row">
                        <div className="col text-title">
                            {title}
                        </div>
                        <div
                            onClick={this.toggleCollapse}
                            className="col text-right title-collapse"
                        >
                            {collapse ? 'Show More' : 'Show Less'}
                        </div>
                    </div>
                </div>
                <div className={`card-body ${collapse ? 'card-collapse' : 'card-expand'}`}>
                    <div className="row">
                        <div className="col-5 ">
                            <textarea className="text-content">
                                {text}
                            </textarea>
                        </div>
                        <div className="col-7 module-selection">
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
                        <button onClick={this.saveText} className='card-buttons save-button'>
                            Save
                        </button>
                        <button onClick={this.deleteText} className='card-buttons delete-button'>
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
};

export class InstructorView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textData: null,
            showModal: false,
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
                <button onClick={this.modalHandler}>Add Text</button>
                <div>
                    {
                        this.state.showModal
                            ? <div className="backdrop" onClick={this.modalHandler}>
                            </div>
                            : null
                    }
                    <div className="Modal modal-content" style={{
                        transform: this.state.showModal
                            ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.state.showModal ? 1 : 0,
                    }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Instructions</h5>
                            <button type="button" className="close" onClick={this.modalHandler}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Instructions will go here.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                onClick={this.modalHandler}>Close</button>
                        </div>
                    </div>
                </div>
                {
                    this.state.textData.map((text, i) => (<TextInfo key={i} text={text}/>))
                }
            </div>
            <Footer />
        </React.Fragment>);
    }
}
