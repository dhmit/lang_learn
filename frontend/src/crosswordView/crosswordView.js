import React from 'react';
import * as PropTypes from 'prop-types';

import { Navbar, Footer, LoadingPage } from '../UILibrary/components';
import Crossword from './crossword';

// Given a word and the clue that it is part of, remove the word from the clue
const coverWord = (word, clue) => {
    word = word.toLowerCase();
    return clue.replaceAll(word, '_'.repeat(word.length));
};

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const EASY = 0;
const MEDIUM = 1;
const HARD = 2;
const DIFFICULTY_NAMES = ['Easy', 'Medium', 'Hard'];

export class CrosswordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crosswordData: null,
            grid: null,
            found: null,
            showDifficulty: true,
            showModal: true,
            difficulty: -1,
        };
    }

    componentDidMount = async () => {
        try {
            const apiURL = `/api/get_crossword/${this.props.textID}/${this.props.partOfSpeech}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            const emptyGrid = data.solution.map((row) => row
                .map((cell) => (ALPHA.includes(cell) ? '' : '#')));
            this.setState({
                crosswordData: data,
                grid: emptyGrid,
                found: data.clues.map((_) => ({ across: false, down: false })),
            });
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Given the row and column number, return the clue number associated with that
     * cell only if that cell is the starting cell for a word. Otherwise, return null
     */
    getClueNumber = (row, col) => {
        for (const [clueNum, clue] of this.state.crosswordData.clues.entries()) {
            if (clue.row === row && clue.col === col) {
                return clueNum + 1;
            }
        }
        return null;
    }

    /**
     * Given a row and column number, return true if this cell belongs to a word that has
     * been found. Otherwise, return false.
     */
    isCorrect = (row, col) => {
        const { found, crosswordData } = this.state;
        for (let i = 0; i < found.length; i++) {
            const curFound = found[i];
            const curClue = crosswordData.clues[i];
            // Checking for across clues
            if (curFound.across && row === curClue.row
                && col >= curClue.col && col < curClue.col + curClue.across.word.length) {
                return true;
            }
            // Checking for down clues
            if (curFound.down && col === curClue.col
                && row >= curClue.row && row < curClue.row + curClue.down.word.length) {
                return true;
            }
        }
        return false;
    }

    updateCell = (e, row, col) => {
        const grid = this.state.grid;
        const curLetter = e.target.value.toUpperCase();
        if (ALPHA.includes(curLetter)) {
            grid[row][col] = curLetter;
            // Check if a word has been found
            this.setState({ grid }, this.updateFound);
        }
    }

    updateFound = () => {
        const { grid, found } = this.state;
        this.state.crosswordData.clues.forEach((clue, k) => {
            if (clue.across) {
                let correct = true;
                for (let c = 0; c < clue.across.word.length; c++) {
                    if (grid[clue.row][clue.col + c] !== clue.across.word.charAt(c)) {
                        correct = false;
                        break;
                    }
                }
                found[k].across = correct;
            }
            if (clue.down) {
                let correct = true;
                for (let r = 0; r < clue.down.word.length; r++) {
                    if (grid[clue.row + r][clue.col] !== clue.down.word.charAt(r)) {
                        correct = false;
                        break;
                    }
                }
                found[k].down = correct;
            }
        });
        this.setState({ found });
    }

    giveUp = () => {
        this.setState({ grid: this.state.crosswordData.solution }, this.updateFound);
    }

    setDifficulty = (difficulty) => {
        this.setState({ difficulty, showDifficulty: false });
    }

    getDefinitions = () => {
        const { difficulty, crosswordData, found } = this.state;
        switch (difficulty) {
        case EASY:
            return crosswordData.clues.flatMap((clue, k) => {
                return ['across', 'down'].map((dir) => {
                    if (clue[dir]) {
                        return (
                            <div className={`clue ${found[k][dir] ? 'clue-found' : ''}`}>
                                {`${k + 1}${dir === 'across' ? 'A' : 'D'}) `}
                                { clue[dir].definition ? clue[dir].definition : 'N/A' }
                            </div>
                        );
                    }
                    return '';
                });
            });
        case MEDIUM:
            return (
                <ul>
                    {crosswordData.clues.flatMap((clue, k) => {
                        return ['across', 'down'].map((dir) => {
                            if (clue[dir]) {
                                return (
                                    <li key={`${k}-${dir}`}>
                                        { clue[dir].definition ? clue[dir].definition : 'N/A' }
                                    </li>
                                );
                            }
                            return '';
                        });
                    })}
                </ul>
            );
        case HARD:
            return (
                <ul>
                    {crosswordData.definitions.map((definition, k) => (
                        <li key={k}>
                            { definition }
                        </li>
                    ))}
                </ul>
            );
        default:
            return '';
        }
    }

    modalHandler = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    render() {
        if (!this.state.crosswordData) {
            return (<LoadingPage />);
        }

        const {
            found,
            grid,
            showDifficulty,
            showModal,
        } = this.state;

        const clueBox = <div className='clues-box'>
            <h2 className='clue-header'>Across:</h2>
            {
                this.state.crosswordData.clues.map((clue, k) => {
                    if (clue.across) {
                        return (
                            <div
                                className={`clue ${found[k].across ? 'clue-found' : ''}`}
                                key={k}
                            >
                                {k + 1}) {found[k].across
                                    ? clue.across.clue
                                    : coverWord(clue.across.word, clue.across.clue)
                                }
                            </div>
                        );
                    }
                    return '';
                })
            }
            <h2 className='clue-header'>Down:</h2>
            {
                this.state.crosswordData.clues.map((clue, k) => {
                    if (clue.down) {
                        return (
                            <div
                                className={`clue ${found[k].down ? 'clue-found' : ''}`}
                                key={k}
                            >
                                {k + 1}) {found[k].down
                                    ? clue.down.clue
                                    : coverWord(clue.down.word, clue.down.clue)
                                }
                            </div>
                        );
                    }
                    return '';
                })
            }
        </div>;

        const definitionBox = (<div className='clues-box'>
            <h2 className='clue-header'>Definitions</h2>
            { this.getDefinitions() }
        </div>);

        const instructionModal = (<div>
            {
                showModal
                    ? <div className="backdrop" onClick={this.modalHandler}>
                    </div>
                    : null
            }
            <div className="Modal modal-content" style={{
                transform: showModal ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: showModal ? 1 : 0,
            }}>
                <div className="modal-header">
                    <h5 className="modal-title">Instructions</h5>
                    <button type="button" className="close" onClick={this.modalHandler}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>
                        The goal is to solve the crossword. On the left side, you are given
                        the clues and definitions for a specific word. On the right side,
                        there is a crossword that you can fill in.
                    </p>
                    <p>
                        You can navigate the crossword by clicking on a square and typing
                        to fill it in. You can also use the arrow keys to move to different
                        squares.
                    </p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary"
                        onClick={this.modalHandler}>Close</button>
                </div>
            </div>
        </div>);

        return (
            <>
                <Navbar/>
                <div
                    className='page'
                    style={{ 'paddingBottom': '50px' }}
                >
                    { showDifficulty
                        ? <div>
                            <h1 className='crossword-title'>Select a Crossword Difficulty</h1>
                            <div className='d-flex justify-content-between mt-5'>
                                {[EASY, MEDIUM, HARD].map((difficulty) => (
                                    <button
                                        className='btn btn-light difficulty-button'
                                        onClick={() => this.setDifficulty(difficulty)}
                                        key={difficulty}
                                    >
                                        { DIFFICULTY_NAMES[difficulty] }
                                    </button>
                                ))}
                            </div>
                        </div>
                        : <>
                            {instructionModal}
                            <h1 className='crossword-title'>
                                Crossword
                                <button className="btn btn-outline-light btn-circle mx-3"
                                    style= {{ 'border': '3px solid', 'fontSize': '20px' }}
                                    onClick={this.modalHandler}>
                                    <b>?</b>
                                </button>
                            </h1>
                            <button className='btn btn-danger give-up' onClick={this.giveUp}>
                                Give Up
                            </button>
                            <div className='row'>
                                <div className='col-xl-5 col-12'>
                                    { clueBox }
                                    { definitionBox }
                                </div>
                                <div
                                    className='col-xl-7 col-12 d-flex'
                                    style={{ overflowX: 'scroll', alignContent: 'center' }}
                                >
                                    <div className='crossword-grid'>
                                        <Crossword
                                            grid={grid}
                                            isCorrect={this.isCorrect}
                                            getClueNumber={this.getClueNumber}
                                            updateCell={this.updateCell}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                </div>
                <Footer/>
            </>
        );
    }
}
CrosswordView.propTypes = {
    textID: PropTypes.number,
    partOfSpeech: PropTypes.string,
};
