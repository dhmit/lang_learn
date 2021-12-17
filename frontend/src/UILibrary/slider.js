import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as PropTypes from 'prop-types';

const tickStyle = {
    width: '50px',
    marginTop: '32px',
    fontFamily: 'GillSans',
    fontSize: '16px',
    fontWeight: 600,
    fontWretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#ff3300'
};

export default function Slider(props) {
    const allMarks = {};
    console.log(props);
    console.log(props.min);
    console.log(props.max);
    console.log(props.labels);
    props.labels.forEach((label, count) => {
        allMarks[count] = {
            style: {tickStyle},
            label,
        };
    });
    console.log(allMarks);
    console.log(Object.keys(allMarks).length);

    return (
        <Range
            min={0}
            max={Object.keys(allMarks).length - 1}
            marks={allMarks}
            onChange={props.onChange}
            style={props.style}
        />
    );
}
Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    labels: PropTypes.array,
    onChange: PropTypes.func,
    style: PropTypes.object, // TODO: change to not required
};




