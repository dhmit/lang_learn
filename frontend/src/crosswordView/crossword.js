import React from 'react';
import * as PropTypes from 'prop-types';

class Crossword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    changeFocusDelta = (dr, dc) => {
        const { focusRow, focusCol } = this.state;
        const { grid } = this.props;
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

    changeFocus = (row, col) => {
        this.cellRefs[`cell-${row},${col}`].focus();
        this.setState({ focusRow: row, focusCol: col });
    }

    render() {
        return this.props.grid.map((row, rowIndex) => {
            return (
                <div className='crossword-row' key={rowIndex}>
                    {row.map((cell, colIndex) => {
                        if (cell === '#') {
                            return (
                                <div className='blank-cell' key={colIndex}>
                                    <input
                                        className='blank-input'
                                        readOnly
                                    />
                                </div>
                            );
                        }
                        const clueNum = this.props.getClueNumber(rowIndex, colIndex);
                        const isCorrect = this.props.isCorrect(rowIndex, colIndex);
                        return (
                            <div className='crossword-cell' key={colIndex}>
                                <div className='clue-num'>
                                    {clueNum}
                                </div>
                                <input
                                    className={`cell-input ${isCorrect ? 'correct-cell' : ''}`}
                                    type='text'
                                    value={cell}
                                    maxLength={1}
                                    ref={(instance) => {
                                        this.cellRefs[`cell-${rowIndex},${colIndex}`] = instance;
                                    }}
                                    onClick={() => this.changeFocus(rowIndex, colIndex)}
                                    onChange={(e) => this.props.updateCell(e, rowIndex, colIndex)}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        });
    }
}
Crossword.propTypes = {
    grid: PropTypes.array,
    updateCell: PropTypes.func,
    getClueNumber: PropTypes.func,
    isCorrect: PropTypes.func,
};

export default Crossword;
