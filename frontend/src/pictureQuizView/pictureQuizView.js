import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

export class YoloModelDisplayWidget extends React.Component {
    render() {
        const items = [];
        let box;
        const ratio = this.props.height / this.props.natHeight;
        for (box of this.props.boxes) {
            items.push(
                <rect
                    className = 'outsideBox'
                    x = {box['x_coord'] * ratio}
                    y = {box['y_coord'] * ratio}
                    height = {box['height'] * ratio}
                    width = {box['width'] * ratio}
                />,
                <g className={'boxGroup'}>
                    <text
                        className='label'
                        x = {box['x_coord'] * ratio}
                        y = {box['y_coord'] * ratio - 5}
                    >
                        {box['label']}
                    </text>
                    <rect
                        className = 'boundingBox'
                        x = {box['x_coord'] * ratio}
                        y = {box['y_coord'] * ratio}
                        height = {box['height'] * ratio}
                        width = {box['width'] * ratio}
                    />
                </g>,
            );
        }

        return (
            <div>
                <svg
                    className='analysis-overlay positionTopLeft'
                    height={this.props.height}
                    width={this.props.width}
                >
                    {items}
                </svg>
            </div>
        );
    }
}

function configAnalysisYoloModel(parsedValue, height, width, natHeight, natWidth) {
    let boxes = [];
    if ('boxes' in parsedValue) {
        boxes = parsedValue['boxes'];
    }
    return (
        <YoloModelDisplayWidget
            boxes={boxes}
            height={height}
            width={width}
            natHeight={natHeight}
            natWidth={natWidth}
        />
    );
}

YoloModelDisplayWidget.propTypes = {
    boxes: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    natHeight: PropTypes.number,
    natWidth: PropTypes.number,
};

export class PictureQuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            gameOver: false,
            timeLeft: 10,
            showModal: false,
            question: 1,
            numQuestions: 1,
            photoData: null,
            loading: true,
            width: null,
            height: null,
            natWidth: null,
            natHeight: null,
            objects: null,
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.modalHandler = this.modalHandler.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
        this.photoRef = React.createRef();
    }

    async componentDidMount() {
        await this.startNewGame();
    }

    nextQuestion = () => {
        const nextQuestionNumber = this.state.question + 1;
        this.setState({
            question: nextQuestionNumber,
            timeLeft: 15,
            gameOver: false,
        });
        this.timer = 0;
        this.startTimer();
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
            const photoData = await response.json();
            console.log(photoData);
            console.log(Object.keys(photoData.objects.labels)[1]);
            const numQuestions = Object.keys(photoData.objects.labels).length;
            this.timer = 0;
            this.setState({
                loading: false,
                photoData,
                numQuestions,
            });
            this.startTimer();
        } catch (e) {
            console.log(e);
        }
    }

    onImgLoad({ target: img }) {
        this.setState({
            width: img.clientWidth,
            height: img.clientHeight,
            natWidth: img.naturalWidth,
            natHeight: img.naturalHeight,
        });
    }

    handleResize() {
        const img = this.photoRef.current;
        this.setState({
            height: img.getBoundingClientRect()['height'],
            width: img.getBoundingClientRect()['width'],
        });
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
        if (this.state.loading) {
            return (<LoadingPage/>);
        }



        window.addEventListener('resize', () => this.handleResize());

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
                        Find this object in the image below:
                    </div>
                    <div className="row justify-content-center">
                        <h3>
                            {Object.keys(this.state.photoData.objects.labels)[this.state.question - 1]}
                        </h3>
                    </div>
                    <div className="image-view row justify-content-center">
                        <img
                            className='image-photo'
                            src={this.state.photoData['image']}
                            onLoad={this.onImgLoad}
                            ref={this.photoRef}
                        />
                        {
                            configAnalysisYoloModel(
                                this.state.photoData,
                                this.state.height,
                                this.state.width,
                                this.state.natHeight,
                                this.state.natWidth,
                            )
                        }
                        <svg
                            height={this.state.height}
                            width={this.state.width}
                        >
                        </svg>
                    </div>
                    <div className="row justify-content-center">
                        <button className="btn btn-success mx-3 child"
                            onClick={this.nextQuestion}
                            disabled={!this.state.gameOver
                            || this.state.question === this.state.numQuestions}>Next
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

