import React from 'react';
import * as PropTypes from 'prop-types';
import {
    Slider, Rail, Handles, Tracks, Ticks
} from 'react-compound-slider';
import {
    SliderRail, Handle, Track, Tick
} from './slider';
import {getCookie} from "../common"; // example render components -
// source below
export class ShortVideoClipsModal extends React.Component {
    constructor(props) {
        super(props);
    }
    handleSubmit = (event) => {

    }
    onCancel =  (event) => {

    }

    render() {
        const domain = [1, 5];
        const defaultValues = [2.5, 3.5];

        return (
            <div>
                    <div className='modal-header'>
                        <h5 className='modal-title'>Create Video</h5>
                        <button type='button' className='close' onClick={() => {}}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <h4 className='modal-title'>Youtube URL:</h4>
                    <form onSubmit={() => {}}>
                        <label htmlFor='youtube-url-input' />
                        <input id='youtube-url-input' type='url' />
                    </form>
                    <section>
                        <h4 className='modal-title'>Content: </h4>
                        <form onSubmit={() => {}}>
                            <label htmlFor='youtube-video-title'> Title: </label>
                            <input id='youtube-video-title' type='text' value='Cooking with Gordon' />
                        </form>
                        <h4 className='modal-title'>Time: </h4>
                        <div style={{ margin: '6%', height: 10, width: '80%'}}>
                            <Slider
                              mode={2}
                              step={0.1}
                              domain={domain}
                              rootStyle={{position: 'relative', width: '100%'}}
                              onUpdate={this.onUpdate}
                              onChange={this.onChange}
                              values={defaultValues}
                            >
                              <Rail>
                                {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                              </Rail>
                              <Handles>
                                {({ handles, getHandleProps }) => (
                                  <div className='slider-handles'>
                                    {handles.map((handle) => (
                                      <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={domain}
                                        getHandleProps={getHandleProps}
                                      />
                                    ))}
                                  </div>
                                )}
                              </Handles>
                              <Tracks left={false} right={false}>
                                {({ tracks, getTrackProps }) => (
                                  <div className='slider-tracks'>
                                    {tracks.map(({ id, source, target }) => (
                                      <Track
                                        key={id}
                                        source={source}
                                        target={target}
                                        getTrackProps={getTrackProps}
                                      />
                                    ))}
                                  </div>
                                )}
                              </Tracks>
                              <Ticks count={10}>
                                {({ ticks }) => (
                                  <div className='slider-ticks'>
                                    {ticks.map((tick) => (
                                      <Tick key={tick.id} tick={tick} count={ticks.length} />
                                    ))}
                                  </div>
                                )}
                              </Ticks>
                            </Slider>
                        </div>
                        <h4 className='modal-title'>Quiz Type: </h4>
                        <form>
                            <input id='video-to-text' type='radio' name='content-type'/>
                            <label htmlFor='video-to-text'>Match Video to Text</label><br/>
                            <input id='text-to-video' type='radio' name='content-type'/>
                            <label htmlFor='text-to-video'>Match Text to Video</label>
                        </form>
                    </section>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-danger'
                            onClick={this.onCancel}>Cancel</button>
                        <button type='submit' className='btn btn-success'
                                onClick={this.handleSubmit}>
                            Next
                        </button>
                    </div>
            </div>);
    }
}

export default ShortVideoClipsModal;

