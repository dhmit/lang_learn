import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

const coverWord = (word, clue) => {
    return clue.replaceAll(word, '_'.repeat(word.length));
};

// Remove words from all the clues
const clearClues = (data) => {
    data.clues.forEach((clue) => {
        if (clue.across) {
            clue.across.clue = coverWord(clue.across.word.toLowerCase(), clue.across.clue);
        }
        if (clue.down) {
            clue.down.clue = coverWord(clue.down.word.toLowerCase(), clue.down.clue);
        }
    });
};

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class CrosswordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crosswordData: null,
            grid: null,
            found: null,
            focusRow: null,
            focusCol: null,
        };
        /**
         * cellRefs maps cell names in the form of cell-{row},{col} to the ref for that cell
         * This is used for calling the .focus() method for each individual cell.
         * The refs are created using callback refs
         * (https://reactjs.org/docs/refs-and-the-dom.html#callback-refs)
         */
        this.cellRefs = {};
    }

    componentDidMount = async () => {
        try {
            const apiURL = `/api/get_crossword/${this.props.textID}/${this.props.partOfSpeech}`;
            const response = await fetch(apiURL);
            const data = await response.json();
            // const data = testData;
            clearClues(data);
            const emptyGrid = data.solution.map((row) => row
                .map((cell) => (ALPHA.includes(cell) ? '' : '#')));
            this.setState({
                crosswordData: data,
                grid: emptyGrid,
                found: data.clues.map((_) => ({ across: false, down: false }))
            });
        } catch (e) {
            console.log(e);
        }
        document.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    changeFocus = (r, c) => {
        this.cellRefs[`cell-${r},${c}`].focus();
        this.setState({ focusRow: r, focusCol: c });
    }

    changeFocusDelta = (dr, dc) => {
        const { grid, focusRow, focusCol } = this.state;
        const gridHeight = grid.length;
        const gridWidth = grid[0].length;

        let curR = (gridHeight + focusRow + dr) % gridHeight;
        let curC = (gridWidth + focusCol + dc) % gridWidth;
        for (let i = 0; i <= Math.max(gridHeight, gridWidth); i++) {
            if (grid[curR][curC] !== '#') {
                this.cellRefs[`cell-${curR},${curC}`].focus();
                break;
            }
            curR = (gridHeight + curR + dr) % gridHeight;
            curC = (gridWidth + curC + dc) % gridWidth;
        }
        this.setState({ focusRow: curR, focusCol: curC });
    }

    handleKeyDown = (e) => {
        const deltas = {
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
        };
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
            e.preventDefault();
            const { code } = e;
            this.changeFocusDelta(deltas[code][0], deltas[code][1]);
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

    render() {
        if (!this.state.crosswordData) {
            return (<LoadingPage />);
        }

        const { found } = this.state;
        console.log(this.state);

        const clueBox = <div className='clues-box'>
            <h2 className='clue-header'>Across:</h2>
            {
                this.state.crosswordData.clues.map((clue, k) => {
                    if (clue.across) {
                        return (
                            <div
                                className={
                                    `clue ${found[k].across
                                        ? 'clue-found'
                                        : ''}`
                                }
                                key={k}
                            >
                                {k + 1}) {clue.across.clue}
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
                                className={
                                    `clue ${found[k].down
                                        ? 'clue-found'
                                        : ''}`
                                }
                                key={k}
                            >
                                {k + 1}) {clue.down.clue}
                            </div>
                        );
                    }
                    return '';
                })
            }
        </div>;

        const crossword = this.state.grid.map((row, r) => {
            return (
                <div className='crossword-row' key={r}>
                    {row.map((cell, c) => {
                        if (cell === '#') {
                            return (
                                <div className='blank-cell' key={c}>
                                    <input
                                        className='blank-input'
                                        readOnly
                                    />
                                </div>
                            );
                        }
                        const clueNum = this.getClueNumber(r, c);
                        const isCorrect = this.isCorrect(r, c);
                        return (
                            <div className='crossword-cell' key={c}>
                                <div className='clue-num'>
                                    {clueNum}
                                </div>
                                <input
                                    className={`cell-input ${isCorrect ? 'correct-cell' : ''}`}
                                    type='text'
                                    value={cell}
                                    maxLength={1}
                                    ref={(instance) => {
                                        this.cellRefs[`cell-${r},${c}`] = instance;
                                    }}
                                    onClick={() => this.changeFocus(r, c)}
                                    onChange={(e) => this.updateCell(e, r, c)}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        });

        return (
            <>
                <Navbar/>
                <div
                    className='page'
                    style={{ 'paddingBottom': '50px' }}
                    onKeyDown={this.handleKeyDown}
                >
                    <h1 className='crossword-title'>Crossword</h1>
                    <div className='row'>
                        <div className='col-xl-5 col-12'>
                            { clueBox }
                            <div className='clues-box'>
                                <h2 className='clue-header'>Definitions</h2>
                                <ul>
                                    {this.state.crosswordData.definitions.map((definition, k) => (
                                        <li key={k}>
                                            { definition }
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>
                        <div className='col-xl-7 col-12'>
                            <div className='crossword-grid'>
                                {crossword}
                            </div>
                        </div>
                    </div>
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
