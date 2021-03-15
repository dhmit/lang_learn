import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

const testData = {
    definitions: [
        'How you feel in Thanksgiving',
        'When you shake your head up and down',
        'Big gray animal, moto moto',
        'A common greeting',
        'A vehicle that allows you to travel by air',
        'Orange soda that rhymes with santa',
        'Frozen rain',
        'Yellow particles found at the beach',
        'A hardware device that converts data from a digital format into one suitable for a'
        + ' transmission medium such as telephone lines or radio.',
        'When you have no friends',
        'Opposite of subtract',
        'When you are finished with something',
        'How one feels when they say "you too" in response to "happy birthday"',
    ],
    clues: [
        {
            row: 2,
            col: 0,
            across: null,
            down: {
                word: 'THANKFUL',
                clue: 'As we ate turkey, we thought about the things we were ________ for in our'
                       + ' lives.',
            },
        },
        {
            row: 5,
            col: 0,
            across: {
                word: 'NOD',
                clue: 'They ___ their heads.',
            },
            down: null,
        },
        {
            row: 0,
            col: 3,
            across: {
                word: 'HIPPO',
                clue: 'The _____ has giant teeth that crushed watermelons.',
            },
            down: {
                word: 'HELLO',
                clue: 'When I picked up the phone, I said _____.',
            },
        },
        {
            row: 0,
            col: 5,
            across: null,
            down: {
                word: 'PLANE',
                clue: 'Its a bird, its a _____, its superman!',
            },
        },
        {
            row: 7,
            col: 0,
            across: {
                word: 'FANTA',
                clue: 'My friend loves to drink _____.',
            },
            down: null,
        },
        {
            row: 6,
            col: 4,
            across: {
                word: 'SNOW',
                clue: 'Every christmas, there is always ____ outside.',
            },
            down: {
                word: 'SAND',
                clue: 'I felt the hot ____ between my toes.',
            },
        },
        {
            row: 5,
            col: 6,
            across: null,
            down: {
                word: 'MODEM',
                clue: 'I tried turning the _____ on and off but it didn’t work.',
            },
        },
        {
            row: 3,
            col: 2,
            across: {
                word: 'ALONE',
                clue: 'During quarantine, I felt quite _____.',
            },
            down: {
                word: 'ADD',
                clue: 'When you ___ 2 and 2, you get 4.',
            },
        },
        {
            row: 4,
            col: 2,
            across: {
                word: 'DONE',
                clue: 'At last, Bob was ____ with his homework.',
            },
            down: null,
        },
        {
            row: 9,
            col: 4,
            across: {
                word: 'DUMB',
                clue: 'After failing his test, Leo felt ____.',
            },
            down: null,
        },
    ],
    solution: [
        ['#', '#', '#', 'H', 'I', 'P', 'P', 'O'],
        ['#', '#', '#', 'E', '#', 'L', '#', '#'],
        ['T', '#', '#', 'L', '#', 'A', '#', '#'],
        ['H', '#', 'A', 'L', 'O', 'N', 'E', '#'],
        ['A', '#', 'D', 'O', 'N', 'E', '#', '#'],
        ['N', 'O', 'D', '#', '#', '#', 'M', '#'],
        ['K', '#', '#', '#', 'S', 'N', 'O', 'W'],
        ['F', 'A', 'N', 'T', 'A', '#', 'D', '#'],
        ['U', '#', '#', '#', 'N', '#', 'E', '#'],
        ['L', '#', '#', '#', 'D', 'U', 'M', 'B'],
    ],
};

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
            found: testData.clues.map((_) => ({ across: false, down: false })),
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
