import React from 'react';
import './quizView.scss';
// import ReactTooltipDefaultExport from 'react-tooltip';
// import * as PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

export class AllQuizView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('/api/all_text/');
            const data = await response.json();
            this.setState({ data: data });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.data) {
            return (<LoadingPage />);
        }

        const textList = this.state.data.map((text, i) => {
            return (
                <Button key={i + 1} id='quiz-text' href={`/quiz/${text.id}`}>
                    {text.title}
                </Button>
            );
        });

        return (<>
            <Navbar />
            <div className="page">
                <div className="row justify-content-between" id="top">
                    <div className="col">
                        <h1 className="quiz-title">Verb Conjugation Quiz</h1>
                        <p className="quiz-author"><i>by Takako Aikawa</i></p>
                    </div>
                    <div className="col text-right submit-button">
                        <Button id="submit">
                            Add Text
                        </Button>
                    </div>
                </div>
                <div className="row text-list">
                    {textList}
                </div>
            </div>
            <Footer />
        </>);
    }
}

export default AllQuizView;
