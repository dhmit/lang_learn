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
            clues: null,
            definitions: null,
            solution: null,
            grid: null,
            found: null,
            showDifficulty: true,
            showModal: false,
            difficulty: -1,
            isLoading: true,
        };
    }

    componentDidMount = async () => {
        try {
            const apiURL = `/api/get_crossword/${this.props.textID}/${this.props.partOfSpeech}`;
            const response = await fetch(apiURL);
            const { clues, definitions, solution } = await response.json();

            const emptyGrid = solution.map((row) => row
                .map((cell) => (ALPHA.includes(cell) ? '' : '#')));

            /**
             * definitions contains the definitions of every word in the input text
             * clues contains the individual definitions for each word that appears
             */
            this.setState({
                clues,
                definitions,
                solution,
                grid: emptyGrid,
                found: clues.map((_) => ({ across: false, down: false })),
                isLoading: false,
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
        for (const [clueNum, clue] of this.state.clues.entries()) {
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
        const { found, clues } = this.state;
        for (let i = 0; i < found.length; i++) {
            const curFound = found[i];
            const curClue = clues[i];
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
        const curLetter = e.target.value.toUpperCase();
        if (!ALPHA.includes(curLetter)) {
            return;
        }

        // Check if a word has been found after adding the letter
        this.setState((state) => ({
            grid: state.grid.map((tempRow, tempRowIndex) => tempRow.map(
                (tempCol, tempColIndex) => (
                    row === tempRowIndex && col === tempColIndex
                        ? curLetter
                        : tempCol
                ),
            )),
        }), this.updateFound);
    }

    updateFound = () => {
        const { grid, found, clues } = this.state;
        const newFound = found.map((clue) => ({ across: clue.across, down: clue.down }));

        clues.forEach((clue, k) => {
            if (clue.across) {
                let correct = true;
                for (let dCol = 0; dCol < clue.across.word.length; dCol++) {
                    if (grid[clue.row][clue.col + dCol] !== clue.across.word.charAt(dCol)) {
                        correct = false;
                        break;
                    }
                }
                newFound[k].across = correct;
            }
            if (clue.down) {
                let correct = true;
                for (let dRow = 0; dRow < clue.down.word.length; dRow++) {
                    if (grid[clue.row + dRow][clue.col] !== clue.down.word.charAt(dRow)) {
                        correct = false;
                        break;
                    }
                }
                newFound[k].down = correct;
            }
        });

        this.setState({ found: newFound });
    }

    giveUp = () => {
        this.setState({ grid: this.state.solution }, this.updateFound);
    }

    setDifficulty = (difficulty) => {
        this.setState({ difficulty, showDifficulty: false, showModal: true });
    }

    getDefinitions = () => {
        const {
            difficulty,
            clues,
            definitions,
            found,
        } = this.state;

        switch (difficulty) {
        case EASY:
            // Creates list of definitions where each one is paired with its clue
            return clues.flatMap((clue, k) => (['across', 'down']
                .filter((dir) => clue[dir])
                .map((dir) => (
                    <div
                        className={`clue ${found[k][dir] ? 'clue-found' : ''}`}
                        key={`${k}-${dir}`}
                    >
                        {`${k + 1}${dir === 'across' ? 'A' : 'D'}) `}
                        { clue[dir].definition ? clue[dir].definition : 'N/A' }
                    </div>
                ))
            ));
        case MEDIUM:
            // Creates unordered list of definitions
            return (
                <ul>
                    {clues.flatMap((clue, k) => (['across', 'down']
                        .filter((dir) => clue[dir])
                        .map((dir) => (
                            <li key={`${k}-${dir}`}>
                                {clue[dir].definition ? clue[dir].definition : 'N/A'}
                            </li>
                        ))
                    ))}
                </ul>
            );
        case HARD:
            // Creates unordered list of all definitions, some of which might not be used
            return (
                <ul>
                    {definitions.map((definition, k) => (
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
        this.setState((state) => ({ showModal: !state.showModal }));
    }

    /**
     * Render Methods
     */

    renderClueBox = () => {
        const { found, clues } = this.state;
        return <div className='clues-box'>
            {['across', 'down'].map((dir) => (
                <>
                    <h2 className='clue-header'>{dir}:</h2>
                    {clues.filter((clue) => clue[dir]).map((clue) => (
                        <div
                            className={`clue ${found[clue.num][dir] ? 'clue-found' : ''}`}
                            key={clue.num}
                        >
                            {clue.num + 1}) {found[clue.num][dir]
                                ? clue[dir].clue
                                : coverWord(clue[dir].word, clue[dir].clue)
                            }
                        </div>
                    ))}
                </>
            ))}
        </div>;
    }

    renderDefinitionBox = () => (<div className='clues-box'>
        <h2 className='clue-header'>Definitions</h2>
        { this.getDefinitions() }
    </div>)

    renderInstructionModal = () => {
        const { showModal } = this.state;
        return <div>
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
                    <h2 className="modal-title">Instructions</h2>
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
        </div>;
    }

    renderDifficultySelection = () => (<form>
        <label className='difficulty-label'>Please select a difficulty:</label>
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
    </form>)

    renderCrosswordView = () => {
        return <>
            <button className='btn btn-danger give-up' onClick={this.giveUp}>
                Give Up
            </button>
            <div className='row'>
                <div className='col-xl-5 col-12'>
                    { this.renderClueBox() }
                    { this.renderDefinitionBox() }
                </div>
                <div className='col-xl-7 col-12 d-flex crossword-div'>
                    <div className='crossword-grid'>
                        <Crossword
                            grid={this.state.grid}
                            isCorrect={this.isCorrect}
                            getClueNumber={this.getClueNumber}
                            updateCell={this.updateCell}
                        />
                    </div>
                </div>
            </div>
        </>;
    }

    render() {
        if (this.state.isLoading) {
            return (<LoadingPage />);
        }

        return (
            <>
                <Navbar/>
                <div className='page crossword-page'>
                    {this.renderInstructionModal()}
                    <h1 className='crossword-title'>
                        Crossword
                        <button
                            className='btn btn-outline-light btn-circle mx-3 instruction-button'
                            onClick={this.modalHandler}
                        >
                            <b>?</b>
                        </button>
                    </h1>
                    {this.state.showDifficulty
                        ? this.renderDifficultySelection()
                        : this.renderCrosswordView()
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
