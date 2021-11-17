import React, { useContext, useState } from 'react';
import getVideoId from 'get-video-id';
import Slider from '../../UILibrary/slider';
import ExerciseTypes from '../ExerciseTypes';
import { InstructorViewContext } from '../../contexts/InstructorViewContext';
import VideoPlayer from '../../UILibrary/VideoPlayer';

// source below
export default function ShortVideoClipsModal() {
    const state = useContext(InstructorViewContext);
    const [youtubeVideoID, setYoutubeVideoID] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    // transcript from backend
    const [transcript, setTranscript] = useState([]);
    // [start, end]
    const [videoRange, setVideoRange] = useState([0, 0]);
    const [videoTranscript, setVideoTranscript] = useState('');

    const modalHandler = (exerciseType, event) => {
        event.preventDefault();
        state.setShowModal(exerciseType);
    };

    const getTranscript = async (event) => {
        event.preventDefault();
        const urlInputted = document.getElementById('youtube-url-input').value;
        const videoID = getVideoId(urlInputted).id;
        setYoutubeVideoID(videoID);

        if (videoID) {
            try {
                const response = await fetch(`/api/get_video_transcript/${videoID}`);
                console.log(response);
                const data = await response.json();
                setVideoTitle(data.title);
                setTranscript(data.transcript);
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        }
        // TODO:  handle error casE
    };

    const convertToSeconds = (time) => {
        console.log('time here ... ', time);
        const [minuteString, secondString] = time.split(':');
        const minute = parseInt(minuteString);
        const seconds = parseInt(secondString);
        return minute * 60 + seconds;
    };

    const sliderChange = (sliderValues) => {
        const start = sliderValues[0];
        const end = sliderValues[1];
        const startData = transcript[start];
        const startTime = transcript[start].start;
        const endTime = end < transcript.length
            ? transcript[end].start
            : transcript[end - 1].end; // treat end of slider as the end of the whole video
        let entireTranscript = '';
        for (let i = start; i < end; i++) {
            entireTranscript += ' ' + (i < transcript.length
                ? transcript[i].text
                : '');
        }
        setVideoTranscript(entireTranscript);
        setVideoRange([convertToSeconds(startData.start), convertToSeconds(endTime)]);

        // format is 00:00 so we must convert this to seconds

        console.log('start ', start);
        console.log('start mark ', startTime);
        console.log('end ', end);
        console.log('end mark ', endTime);
        console.log(sliderValues);
    };


    return (
        <div >
                <div className='modal-header'>
                    <h5 className='modal-title'>Create Video</h5>
                    <button type='button' className='close'
                            onClick={(e) => modalHandler(ExerciseTypes.NONE, e)}>
                        <span>&times;</span>
                    </button>
                </div>
                <h4 className='modal-title'>Youtube URL:</h4>
                <form onSubmit={getTranscript}>
                    <label htmlFor='youtube-url-input' />
                    <input id='youtube-url-input' type='url'/>
                    <button id='youtube-url-input' type="submit"> Submit URL </button>
                </form>
                <section>
                    <h4 className='modal-title'>Content: </h4>
                    <form onSubmit={getTranscript}>
                        <label htmlFor='youtube-video-title'> Title: </label>
                        <input id='youtube-video-title' value={videoTitle}/>
                    </form>
                   { transcript.length !== 0 ?
                       <div style={{display: 'flex', flexDirection: 'row'}}>
                           <VideoPlayer
                            youtubeVideoID = {youtubeVideoID}
                            start = {videoRange[0]}
                            end = {videoRange[1]}
                            />
                           <textarea style={{width: '300px', height: '300px'}} value={videoTranscript}/>
                       </div>
                       : null }
                    { transcript.length !== 0 ?
                            <Slider min={transcript[0].start}
                                max={transcript[transcript.length - 1].end}
                                labels={transcript.map((entry) => entry.start)}
                                onChange={sliderChange}
                                style={{ margin: '6%', height: 10, width: '90%'}}
                            >
                            </Slider>

                        : <p> Video Will Be Displayed After Submitting a URL </p>}
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
                        onClick={(e) => modalHandler(ExerciseTypes.NONE, e)}>
                        Cancel</button>
                    <button type='submit' className='btn btn-success'>
                        Next
                    </button>
                </div>
        </div>);
}
