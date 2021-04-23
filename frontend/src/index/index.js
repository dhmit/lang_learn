import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer } from '../UILibrary/components';


// Functions to use to generate links for different formats
const posLink = (textId, pos) => `${textId}/${pos.toLowerCase()}`;
const idLink = (textId) => `${textId}`;

const PARTS_OF_SPEECH = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Conjugations'];
const QUIZ_TYPES = {
    'Anagrams': ['anagrams', posLink],
    'Flashcards': ['flashcards', posLink],
    'Quiz': ['quiz', idLink],
    'Crossword': ['crossword', posLink],
    'Story Generator': ['picturebook', posLink],
};

class TextInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizType: 'Anagrams',
            partOfSpeech: 'Noun',
        };
    }

    handleQuiz = (e) => {
        this.setState({ quizType: e.target.value });
    }

    handlePos = (e) => {
        this.setState({ partOfSpeech: e.target.value });
    }

    render() {
        // const posLink = pos.toLowerCase();
        const {
            title,
            content,
            textId,
            modules,
        } = this.props;
        const { quizType, partOfSpeech } = this.state;
        const currentLink = QUIZ_TYPES[quizType][1](textId, partOfSpeech);
        return (
            <div className='text-info-div'>
                <h1 className='text-title'>{title}</h1>
                <p className='text-text'>{content}</p>
                <div className='quiz-selection'>
                    <label className='selection-label'>Quiz:</label>
                    <select
                        className='custom-select selection-select'
                        onChange={this.handleQuiz}
                        value={quizType}
                    >
                        {Object.keys(QUIZ_TYPES).map((quiz) => (
                            <option value={quiz} key={quiz}>{quiz}</option>
                        ))}
                    </select>
                    <label className='selection-label'>
                        Part of Speech:
                    </label>
                    <select
                        className='custom-select selection-select'
                        onChange={this.handlePos}
                        value={partOfSpeech}
                    >
                        {PARTS_OF_SPEECH.map((pos) => {
                            if (modules[this.state.quizType.toLowerCase()][pos.toLowerCase()]) {
                                return (<option value={pos} key={pos}>{pos}</option>);
                            }
                            return (<></>);
                        })}
                    </select>
                    <a href={`/${QUIZ_TYPES[quizType][0]}/${currentLink}`}>
                        <button className='btn btn-light selection-button'>Start!</button>
                    </a>
                </div>

            </div>
        );
    }
}
TextInfo.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    textId: PropTypes.number,
    modules: PropTypes.object,
};

export class IndexView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch('/api/all_text');
            const data = await response.json();
            this.setState({ data });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.data) {
            return (<>
                Loading!
            </>);
        }

        return (<React.Fragment>
            <Navbar />
            <div className="page">
                {this.state.data.map((text, k) => (
                    <TextInfo
                        key={k}
                        title={text.title}
                        content={text.content}
                        textId={text.id}
                        modules={text.modules}
                    />
                ))}
            </div>
            <Footer />
        </React.Fragment>);
    }
}
export default IndexView;
