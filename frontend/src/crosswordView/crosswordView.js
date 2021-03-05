import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

const testData = {
    clues: [
        {
            row: 2,
            col: 0,
            across: null,
            down: {
                word: 'THANKFUL',
                clue: 'How you feel in Thanksgiving',
            },
        },
        {
            row: 5,
            col: 0,
            across: {
                word: 'NOD',
                clue: 'When you shake your head up and down',
            },
            down: null,
        },
        {
            row: 0,
            col: 3,
            across: {
                word: 'HIPPO',
                clue: 'Big gray animal, moto moto',
            },
            down: {
                word: 'HELLO',
                clue: 'A common greeting',
            },
        },
        {
            row: 0,
            col: 5,
            across: null,
            down: {
                word: 'PLANE',
                clue: 'A vehicle that allows you to travel by air',
            },
        },
        {
            row: 7,
            col: 0,
            across: {
                word: 'FANTA',
                clue: 'Orange soda that rhymes with santa',
            },
            down: null,
        },
        {
            row: 6,
            col: 4,
            across: {
                word: 'SNOW',
                clue: 'Frozen rain',
            },
            down: {
                word: 'SAND',
                clue: 'Yellow particles found at the beach',
            },
        },
        {
            row: 5,
            col: 6,
            across: null,
            down: {
                word: 'MODEM',
                clue: 'A hardware device that converts data from a digital format into one'
                    + ' suitable for a transmission medium such as telephone lines or radio.',
            },
        },
        {
            row: 3,
            col: 2,
            across: {
                word: 'ALONE',
                clue: 'When you have no friends',
            },
            down: {
                word: 'ADD',
                clue: 'Opposite of subtract',
            },
        },
        {
            row: 4,
            col: 2,
            across: {
                word: 'DONE',
                clue: 'When you are finished with something',
            },
            down: null,
        },
        {
            row: 9,
            col: 4,
            across: {
                word: 'DUMB',
                clue: 'How one feels when they say "you too" in response to "happy birthday"',
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

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class CrosswordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crosswordData: null,
            grid: null,
            found: testData.clues.map((_) => ({ across: false, down: false })),
        };
    }

    componentDidMount = async () => {
        try {
            // const apiURL = `/api/get_crossword/${this.props.textID}/${this.props.partOfSpeech}`;
            // const response = await fetch(apiURL);
            // const data = await response.json();
            const data = testData;
            const emptyGrid = data.solution.map((row) => row
                .map((cell) => (ALPHA.includes(cell) ? '' : '#')));
            this.setState({
                crosswordData: data,
                grid: emptyGrid,
            });
        } catch (e) {
            console.log(e);
        }
    }

    getClueNumber = (row, col) => {
        for (const [clueNum, clue] of this.state.crosswordData.clues.entries()) {
            if (clue.row === row && clue.col === col) {
                return clueNum + 1;
            }
        }
        return null;
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

        const crossword = this.state.grid.map((row, k) => {
            return (
                <div className='crossword-row' key={k}>
                    {row.map((cell, j) => {
                        if (cell === '#') {
                            return (
                                <div className='blank-cell'/>
                            );
                        }
                        const clueNum = this.getClueNumber(k, j);
                        return (
                            <div className='crossword-cell' key={j}>
                                <div className='clue-num'>
                                    {clueNum}
                                </div>
                                <input
                                    className='cell-input'
                                    type='text'
                                    value={cell}
                                    maxLength={1}
                                    onChange={(e) => this.updateCell(e, k, j)}
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
                <div className='page' style={{ 'paddingBottom': '50px' }}>
                    <h1 className='crossword-title'>Crossword</h1>
                    <div className='row'>
                        <div className='col-lg-6 col-12 clues-box'>
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
                        </div>
                        <div className='col-lg-6 col-12'>
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
