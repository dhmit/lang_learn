import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const tickStyle = {
    width: '50px',
    marginTop: -25,
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

export default function Slider() {
    return (
        <>
            <Range min={1} max={10} marks={{
                1: {
                    style: {tickStyle},
                    label: '0:00'
                },
                2: {
                    style: {tickStyle},
                    label: '1:00'
                }
            }}/>
        </>
    );
}



