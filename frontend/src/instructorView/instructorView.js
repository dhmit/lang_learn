import React from 'react';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import { TextInfo } from './textInfo';

import { getCookie } from '../common';

export class InstructorView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textData: null,
            showModal: false,
            addingText: 0,
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

    deleteText = (id) => {
        let { textData } = this.state;
        textData = textData.filter((text) => text.id !== id);
        this.setState({ textData });
    }

    modalHandler = (event) => {
        event.preventDefault();
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    handleInput = (event) => {
        if (event.target.id === 'title') {
            this.setState({
                addTitle: event.target.value,
            });
        } else {
            this.setState({
                addContent: event.target.value,
            });
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            const apiURL = '/api/add_text';

            this.setState({
                addTitle: '',
                addContent: '',
                addingText: this.state.addingText + 1,
            });
            this.modalHandler(event);

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
                    title: this.state.addTitle,
                    content: this.state.addContent,
                }),
            });

            const newText = await response.json();
            const { textData } = this.state;
            textData.push(newText);
            this.setState({ textData, addingText: this.state.addingText - 1 });
        } catch (e) {
            console.log(e);
        }
    }

    /* Render Methods */
    renderModal = () => <div>
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
                <h2 className="modal-title">Create Resource</h2>
                <button type="button" className="close" onClick={this.modalHandler}>
                    <span>&times;</span>
                </button>
            </div>
            <form onSubmit={this.handleSubmit}>
                <div className="modal-body">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <label htmlFor="title" className="form-label">Title:</label>
                        </div>
                        <div className="col-auto">
                            <input type="text" id="title"
                                className="form-control" onChange={this.handleInput}
                                value={this.state.addTitle} required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="content" className="form-label">Content:</label>
                        <textarea className="form-control" id="content"
                            rows="7" onChange={this.handleInput}
                            value={this.state.addContent} required>
                        </textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger"
                        onClick={this.modalHandler}>Cancel</button>
                    <button type="submit" className="btn btn-success btn-create">
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>;

    renderAddButton = () => <button className='add-text-button' onClick={this.modalHandler}>
        <div className='plus-icon'>
            <div className="plus-1" />
            <div className="plus-2" />
        </div>
        Add Text
    </button>

    renderAlert = () => <div
        className="alert"
        style={{ background: 'rgba(39, 142, 115, 0.6)', color: 'white' }}
        role="alert"
    >
        Currently adding {this.state.addingText} {this.state.addingText > 1 ? ' texts' : ' text'}!
        (Do not close this page.)
    </div>

    render() {
        if (!this.state.textData) {
            return (<LoadingPage text='Setting up Teacher Interface...'/>);
        }
        return (<React.Fragment>
            <Navbar color='light' />
            <div className="page instructor">
                <h1 className='instructor-header'>Resources</h1>
                { this.state.addingText > 0 && this.renderAlert() }
                { this.renderAddButton() }
                { this.renderModal() }
                { this.state.textData.map((text) => (
                    <TextInfo
                        key={text.id}
                        text={text}
                        delete={() => this.deleteText(text.id)}
                    />
                ))}
            </div>
            <Footer />
        </React.Fragment>);
    }
}
