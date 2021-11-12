import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import TextExerciseModal from './modals/TextExercise';
import { InstructorViewContext } from '../contexts/InstructorViewContext';
import ShortVideoClips from './modals/ShortVideoClipsExercise';
import { capitalize, getCookie } from '../common';
import ExerciseType from './ExerciseTypes';

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


export function InstructorView() {
    const [textData, setTextData] = useState(null);
    const [showModal, setShowModal] = useState(ExerciseType.NONE);
    console.log('show modal: ', showModal);
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

    const modalHandler = (exerciseType, event) => {
        console.log('event in instructor view ', event);
        event.preventDefault();
        setShowModal(exerciseType);
        console.log('exercise Type ', exerciseType);
    };


   const deleteText = (id) => {
       setTextData(textData.filter((text) => text.id !== id));
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
            <button className='add-text-button'
                    onClick={(e) => modalHandler(ExerciseType.TEXT, e)}>
                <div className='plus-icon'>
                    <div className="plus-1" />
                    <div className="plus-2"/>
                </div>
                Add Text
            </button>
            <button className='add-text-button'
                    onClick={(e) => modalHandler(ExerciseType.SHORT_VIDEO_CLIPS, e)}>
                <div className='plus-icon'>
                    <div className="plus-1" />
                    <div className="plus-2"/>
                </div>
                Add Short Video Clips
            </button>
            <div>
                {
                    showModal !== ExerciseType.NONE
                        ? <div className="backdrop"
                               onClick={(e) => modalHandler(showModal, e)}>
                        </div>
                        : null
                }
                <div className="Modal modal-content" style={{
                    transform: showModal !== ExerciseType.NONE
                        ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: showModal !== ExerciseType.NONE ? 1 : 0,
                }}>
                    <InstructorViewContext.Provider value={contextState}>
                        {showModal === ExerciseType.TEXT
                            ? <TextExerciseModal/>
                            : <ShortVideoClips/>
                        }
                    </InstructorViewContext.Provider>
                </div>
            {
                textData.map((t) => (
                    <TextInfo
                        key={t.id}
                        text={t}
                        delete={() => deleteText(t.id)}
                    />
                ))
            }
        </div>
            <Footer />
        </div>
    </React.Fragment>);
}

InstructorView.propTypes = {
  delete: PropTypes.func,
};

// export class InstructorView extends React.Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//            textData: null,
//            showModal: false,
//            addingText: 0,
//            addTitle: '',
//            addContent: '',
//        };
//        this.modalHandler = this.modalHandler.bind(this);
//    }
//
//    async componentDidMount() {
//        try {
//            const apiURL = '/api/all_text';
//            const response = await fetch(apiURL);
//            const data = await response.json();
//            this.setState({
//                textData: data,
//            });
//        } catch (e) {
//            console.log(e);
//        }
//    }
//
//    deleteText = (id) => {
//        let { textData } = this.state;
//        textData = textData.filter((text) => text.id !== id);
//        this.setState({ textData });
//    }
//
//    modalHandler = (event) => {
//        event.preventDefault();
//        this.setState({
//            showModal: !this.state.showModal,
//        });
//    }
//
//    handleInput = (event) => {
//        if (event.target.id === 'title') {
//            this.setState({
//                addTitle: event.target.value,
//            });
//        } else {
//            this.setState({
//                addContent: event.target.value,
//            });
//        }
//    }
//
//    handleSubmit = async (event) => {
//        event.preventDefault();
//        try {
//            const csrftoken = getCookie('csrftoken');
//            const apiURL = '/api/add_text';
//
//            this.setState({
//                addTitle: '',
//                addContent: '',
//                addingText: this.state.addingText + 1,
//            });
//            this.modalHandler(event);
//
//            const response = await fetch(apiURL, {
//                credentials: 'include',
//                method: 'POST',
//                mode: 'same-origin',
//                headers: {
//                    'Accept': 'application/json',
//                    'Content-Type': 'application/json',
//                    'X-CSRFToken': csrftoken,
//                },
//                body: JSON.stringify({
//                    title: this.state.addTitle,
//                    content: this.state.addContent,
//                }),
//            });
//
//            const newText = await response.json();
//            const { textData } = this.state;
//            textData.push(newText);
//            this.setState({ textData, addingText: this.state.addingText - 1 });
//        } catch (e) {
//            console.log(e);
//        }
//    }
