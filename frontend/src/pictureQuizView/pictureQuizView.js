import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer } from '../UILibrary/components';

export class PictureQuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            gameOver: false,
            timeLeft: 30,
            showModal: false,
            photo: null,
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.modalHandler = this.modalHandler.bind(this);
    }

    async componentDidMount() {
        await this.startNewGame();
    }

    pauseTimer = () => {
        clearInterval(this.timer);
        this.timer = 0;
    };

    modalHandler = (event) => {
        event.preventDefault();
        if (this.state.showModal) this.startTimer();
        else this.pauseTimer();
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    startNewGame = async () => {
        try {
            const apiURL = `/api/get_picturequiz/${this.props.photoID}/`;
            const response = await fetch(apiURL);
            const data = await response.json();
            console.log(data);
            this.timer = 0;
            this.startTimer();
        } catch (e) {
            console.log(e);
        }
    }

    giveUp = () => {
        this.setState({
            gameOver: true,
        });
    }

    startTimer = () => {
        if (this.timer === 0 && this.state.timeLeft > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown = () => {
        if (this.state.gameOver) {
            clearInterval(this.timer);
        } else {
            const newTimeLeft = this.state.timeLeft - 1;
            if (newTimeLeft === 0 || this.state.gameOver) {
                clearInterval(this.timer);
                this.setState({ gameOver: true });
            }
            this.setState({ timeLeft: newTimeLeft });
        }
    }

    render() {
        return (<React.Fragment>
            <Navbar />
            <div className="page">
                <div className="row">
                    <div className="col">
                        <h1>
                        Picture Quiz
                            <button className="btn btn-outline-light btn-circle mx-3"
                                style= {{ 'border': '3px solid', 'fontSize': '20px' }}
                                onClick={this.modalHandler}>
                                <b>?</b>
                            </button>
                        </h1>
                    </div>
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
                    <div className="col text-right">
                        <h4>Time Left: {this.state.timeLeft}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 text-left">
                        <button className="btn btn-danger mx-3"
                            onClick={this.giveUp}
                            disabled={this.state.gameOver}>Give Up</button>
                    </div>
                    <div className="col text-right">
                        <span className="score">Score: {this.state.score}</span>
                    </div>
                </div>
                <div className = "col shaded-box">
                    <div className="row justify-content-center">
                            <p>Prompt and image will go here.</p>
                    </div>
                    <div className="row justify-content-center">
                            <button className="btn btn-success mx-3 child"
                                disabled={!this.state.gameOver}>Next
                            </button>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>);
    }
}

PictureQuizView.propTypes = {
    photoID: PropTypes.number,
};
