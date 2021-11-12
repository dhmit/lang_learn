import React from 'react';
import Slider from './slider';

// source below
export class ShortVideoClipsModal extends React.Component {
    constructor(props) {
        super(props);
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
                            <Slider></Slider>
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
                            onClick={() => {}}>Cancel</button>
                        <button type='submit' className='btn btn-success'
                                onClick={this.handleSubmit}>
                            Next
                        </button>
                    </div>
            </div>);
    }
}

export default ShortVideoClipsModal;

