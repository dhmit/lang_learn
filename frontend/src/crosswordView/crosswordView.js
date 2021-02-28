import React from 'react';
import * as PropTypes from 'prop-types';
import { Navbar, Footer, LoadingPage } from '../UILibrary/components';

const testData = {
    clues: [
        {
            location: [2, 0],
            across: null,
            down: {
                word: 'thankful',
                clue: 'How you feel in Thanksgiving',
            },
        },
        {
            location: [5, 0],
            across: {
                word: 'nod',
                clue: 'When you shake your head up and down',
            },
            down: null,
        },
        {
            location: [0, 3],
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

export class CrosswordView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crosswordData: testData,
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

    render() {
        if (!this.state.crosswordData) {
            return (<LoadingPage />);
        }

        return (
            <>
                <Navbar/>
                <div className='page'>
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
                            Crossword
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
