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
        this.state = {
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
        };
    }

    updateModule = (module, category, value) => {
        console.log(module, category, value);
        const moduleData = this.state[module];
        moduleData[category] = value;
        this.setState({ [module]: moduleData });
    }

    saveText = () => {
        /* Code for saving text to database */
        console.log('SAVING TEXT');
    }

    deleteText = () => {
        /* Code for deleting text */
        console.log('DELETING TEXT');
    }

    render() {
        const { text } = this.props;
        return (
            <div className="card">
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
                        <div className="col-5 ">
                            <textarea className="text-content">
                                {text['text']}
                            </textarea>
                        </div>
                        <div className="col-7 module-selection">
                            <div className="row">
                                {
                                    Object.keys(this.state).map((module, k) => (
                                        <Module
                                            key={k}
                                            moduleName={module}
                                            moduleInfo={this.state[module]}
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
    text: PropTypes.string,
};

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
                <h1 className='instructor-header'>Resources</h1>
                <button>Add Text</button>
                {
                    this.state.textData.map((text, i) => (<TextInfo key={i} text={text}/>))
                }
            </div>
            <Footer />
        </React.Fragment>);
    }
}
