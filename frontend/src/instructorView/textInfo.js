import React from 'react';
import * as PropTypes from 'prop-types';

import { capitalize, getCookie } from '../common';

export class TextInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: true,
            editing: false,
            currentModule: Object.keys(this.props.text.modules)[0],
            selectedWord: '',

            content: this.props.text.content,
            id: this.props.text.id,
            modules: this.props.text.modules,
            title: this.props.text.title,
            wordData: this.props.text.word_data,
        };
    }

    updateModule = (category, value) => {
        const { modules } = this.state;
        modules[this.state.currentModule][category] = value;
        this.setState({ modules });
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
                body: JSON.stringify({
                    content: this.state.content,
                    id: this.state.id,
                    modules: this.state.modules,
                    title: this.state.title,
                    word_data: this.state.wordData,
                }),
            });
            // Add a delay to this.setState to ensure users see the spinner when saving text
            setTimeout(() => {
                this.setState({ editing: false });
            }, 200);
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
                body: JSON.stringify(this.state.id),
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

    handleTextInfoChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // Handle dropdown changes
    handleWordSelect = (e) => {
        this.setState({ selectedWord: e.target.value });
    }

    handleDefinitionSelect = (e) => {
        e.persist();
        this.setState((state) => {
            const { wordData } = state;
            wordData[state.selectedWord].chosen_definition = e.target.value;
            return { wordData };
        });
    }

    handleExampleSelect = (e) => {
        // This is a work in progress! This shows that we should really consider refactoring
        // the state dict.
        e.persist();
        this.setState((state) => {
            const { wordData } = state;
            wordData[state.selectedWord].chosen_example = e.target.value;
            return { wordData };
        });
    }

    handleImageSelect = (imageSrc) => {
        this.setState((state) => {
            const { wordData } = state;
            wordData[state.selectedWord].chosen_image = imageSrc;
            return { wordData };
        });
    }

    /* Render Methods */
    renderHeader = () => {
        const { collapse, title } = this.state;

        return <div className={`card-header ${collapse ? 'header-round' : ''}`}>
            <div className='row'>
                <div className='col'>
                    <input
                        className='text-title'
                        type='text'
                        name='title'
                        onChange={this.handleTextInfoChange}
                        value={title}
                    />
                </div>
                <div
                    onClick={this.toggleCollapse}
                    className='col text-right collapse-div'
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
        </div>;
    }

    renderCardInfo = () => {
        const { currentModule, modules, content } = this.state;
        return <div className='row mb-4'>
            <div className='col-xl-9 col-12 mb-4 mb-xl-0'>
                <textarea
                    name='content'
                    className = 'text-content'
                    value={content}
                    onChange={this.handleTextInfoChange}
                />
            </div>
            <div className='col-xl-3 col-12 module-selection'>
                <select
                    name='currentModule'
                    className = 'module-select'
                    value={currentModule}
                    onChange={this.handleTextInfoChange}
                >
                    {
                        Object.keys(modules).map((module, k) => (
                            <option key={k} value={module}>
                                {capitalize(module)}
                            </option>
                        ))
                    }
                </select>
                {
                    Object.keys(modules[currentModule]).map((category, k) => (
                        <div className='module-category' key={k}>
                            <input
                                className='module-category-checkbox'
                                type='checkbox'
                                name={category}
                                checked={modules[currentModule][category]}
                                onChange={() => {
                                    this.updateModule(
                                        category,
                                        !modules[currentModule][category],
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
        </div>;
    }

    // WE'RE CODING HERE
    renderWordSelection = () => {
        const wordsInText = Object.keys(this.state.wordData);
        console.log('this is the word_data', this.state.wordData);
        console.log('this is the state:', this.state);
        /*
        this.state.textData.word_data = {
          word1 : {
            chosen_definition: 'definition'
            chosen_example: 'example'
            chosen_image: 'img'
            definitions:
            examples:
            images:
          }
         */

        const options = wordsInText.map((word) => (<option key = {word} value = {word}>
            {word}
        </option>));

        return (<>
            <label className='text-info-label' htmlFor='word-select'>Select a word:</label>
            <select
                className='text-info-dropdown'
                name='selectedWord'
                onChange = {this.handleWordSelect}>
                {options}
            </select>
        </>);
    }

    // WORK IN PROGRESS
    renderWordDefinition = () => {
        const { wordData, selectedWord } = this.state;
        const definitions = [];
        const selectedDefinitions = wordData[this.state.selectedWord]['definitions'];
        for (const partOfSpeech of Object.keys(selectedDefinitions)) {
            for (const definition of selectedDefinitions[partOfSpeech]) {
                definitions.push(definition);
            }
        }

        const options = definitions.map(
            (definition, k) => (
                <option key={k} value={definition}>
                    {definition}
                </option>
            ),
        );
        return (<>
            <label className='text-info-label' htmlFor='definition-select'>
                Definitions:
            </label>
            <select
                className='text-info-dropdown'
                name='definition-select'
                value={this.state.wordData[selectedWord].chosen_definition}
                onChange = {(e) => this.handleDefinitionSelect(e)}
            >
                {options}
            </select>
        </>);
    }

    renderWordExample = () => {
        const selectedWord = this.state.selectedWord;
        const selectedWordExamples = this.state.wordData[selectedWord].examples;
        const examples = (selectedWordExamples
            .map((example) => (<option key={example} value={example}>
                {example}
            </option>))
        );
        return (<>
            <label className='text-info-label' htmlFor='example-select'>Example:</label>
            <select
                className='text-info-dropdown'
                name='example-select'
                value={this.state.wordData[selectedWord].chosen_example}
                onChange={(e) => this.handleExampleSelect(e)}
            >
                {examples}
            </select>
        </>);
    }

    renderImages = () => {
        const { wordData, selectedWord } = this.state;
        const { images } = wordData[selectedWord];
        const chosenImage = wordData[selectedWord]['chosen_image'];
        return images.map((image, k) => (
            <div key={k} className='col-12 col-xl-4 '>
                <img
                    src={image}
                    onClick={() => this.handleImageSelect(image)}
                    className={`card-images ${chosenImage === image ? 'chosen-image' : ''}`}
                />
            </div>
        ));
    }

    renderCardButtons = () => {
        const { editing } = this.state;
        return (<div className='card-button-div'>
            <button
                onClick={this.deleteText}
                className={`card-buttons delete-button ${editing ? 'disabled' : ''}`}
                disabled={editing}
            >
                Delete
            </button>
            <button
                onClick={this.saveText}
                className={`card-buttons save-button ${editing ? 'disabled' : ''}`}
                disabled={editing}
            >
                Save
            </button>
            { editing && <div className='card-loading'>
                <div className='spinner-border card-spinner' role='status'/>
                { /* trying out a Bootstrap progress bar; there's also an HTML5 <progress>
                 element */}
                <div className='progress'>
                    <div className ='progress-bar' role='progressbar'/>
                </div>
            </div>}
        </div>);
    }

    renderCardBody = () => {
        const { collapse } = this.state;
        return (<div className={`card-body ${collapse ? 'card-collapse' : 'card-expand'}`}>
            { this.renderCardInfo() }
            <div className='row'>
                <div className='col-12 col-xl-4'>{ this.renderWordSelection() }</div>
                <div className='col-12 col-xl-4'>
                    { this.state.selectedWord ? this.renderWordDefinition() : <></>}
                </div>
                <div className='col-12 col-xl-4'>
                    {/* The ternary is a *temporary* solution for when the page first loads and
                        the user has not yet selected a word */}
                    { this.state.selectedWord ? this.renderWordExample() : <></> }
                </div>
            </div>
            <div className='row'>
                { this.state.selectedWord ? this.renderImages() : <></> }
            </div>
            { this.renderCardButtons() }
        </div>);
    }


    render() {
        return (
            <div className='card' role='article'>
                { this.renderHeader() }
                { this.renderCardBody() }
            </div>
        );
    }
}
TextInfo.propTypes = {
    text: PropTypes.object,
    delete: PropTypes.func,
};