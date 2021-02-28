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
                word: 'thankful',
                clue: 'How you feel in Thanksgiving',
            },
        },
        {
            row: 5,
            col: 0,
            across: {
                word: 'nod',
                clue: 'When you shake your head up and down',
            },
            down: null,
        },
        {
            row: 0,
            col: 3,
            across: {
                word: 'hippo',
                clue: 'Big gray animal, moto moto',
            },
            down: {
                word: 'hello',
                clue: 'A common greeting',
            },
        },
    ],
    grid: [
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

const testGrid = [
    ['#', '#', '#', '', '', '', '', ''],
    ['#', '#', '#', '', '#', '', '#', '#'],
    ['', '#', '#', '', '#', '', '#', '#'],
    ['', '#', '', '', '', '', '', '#'],
    ['', '#', '', '', '', '', '#', '#'],
    ['', '', '', '#', '#', '#', '', '#'],
    ['', '#', '#', '#', '', '', '', ''],
    ['', '', '', '', '', '#', '', '#'],
    ['', '#', '#', '#', '', '#', '', '#'],
    ['', '#', '#', '#', '', '', '', ''],
];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class CrosswordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crosswordData: testData,
            grid: testGrid,
            found: testData.clues.map((_) => ({ across: false, down: false })),
        };
    }

    componentDidMount = async () => {
        try {
            // const apiURL = `/api/get_crossword/${this.props.textID}/${this.props.partOfSpeech}`;
            // const response = await fetch(apiURL);
            // const data = await response.json();
            // this.setState({
            //     crosswordData: data,
            // });
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
            
            this.setState({ grid });
        }
    }

    render() {
        if (!this.state.crosswordData) {
            return (<LoadingPage />);
        }

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
                                            <div className='clue' key={k}>
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
                                            <div className='clue' key={k}>
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
