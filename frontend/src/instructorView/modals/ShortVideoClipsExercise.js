import React, { useContext, useState } from 'react';
import getVideoId from 'get-video-id';
import TextareaAutosize from 'react-textarea-autosize';
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

    const handleTranscriptChange = (event) => {
        console.log(event.target.value);
        setVideoTranscript(event.target.value);
    };

    const getTranscript = async (event) => {
        event.preventDefault();
        const urlInputted = document.getElementById('youtube-url-input').value;
        const videoID = getVideoId(urlInputted).id;
        setYoutubeVideoID(videoID);
        setVideoTranscript('');

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
        <div className="modal fade" id="videoExerciseModal" tabIndex="-1" aria-labelledby="videoExerciseModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="videoExerciseModalLabel">Create Short Video Clip</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={(e) => modalHandler(ExerciseTypes.NONE, e)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className={transcript.length !== 0 ? 'modal-body short-clip-container' : 'modal-body'}>
                        <section className="short-clip-input-container">
                            <form onSubmit={getTranscript}>
                                <label htmlFor='youtube-url-input' className="form-label mr-2">YouTube URL:</label>
                                <div className="youtube-url-input-container">
                                    <input id='youtube-url-input' type='url'/>
                                    <button className="btn btn-primary ml-2" type="submit"> Submit URL </button>
                                </div>
                            </form>
                        </section>
                        { transcript.length !== 0 ?
                            <section className="short-clip-content">
                                <h4 className='modal-title my-3'>Short Clip Content:</h4>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <VideoPlayer
                                    youtubeVideoID = {youtubeVideoID}
                                    start = {videoRange[0]}
                                    end = {videoRange[1]}
                                    />
                                    <TextareaAutosize value={videoTranscript} onChange={handleTranscriptChange} placeholder='Short clip transcript will show up if timestamp range is selected below' minRows="3" />
                                </div>
                                    <Slider
                                        min={transcript[0].start}
                                        max={transcript[transcript.length - 1].end}
                                        labels={transcript.map((entry) => entry.start).concat(transcript[transcript.length - 1].end)}
                                        onChange={sliderChange}
                                        style={{ margin: '36px', height: 10, width: '90%'}}
                                    >
                                    </Slider>
                            </section>
                        : <p className="short-clip-no-input-msg">*Video Will Be Displayed After Submitting a URL </p>}
                        { transcript.length !== 0 ?
                            <section className="short-clip-quiz-type">
                                <h4 className='modal-title'>Quiz Type: </h4>
                                <input id='video-to-text' type='radio' name='content-type' checked/>
                                <label htmlFor='video-to-text' className="form-label ml-2">Match Video to Text</label><br/>
                                <input id='text-to-video' type='radio' name='content-type'/>
                                <label htmlFor='text-to-video' className="form-label ml-2">Match Text to Video</label>
                            </section>
                        : null}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal"
                            onClick={(e) => modalHandler(ExerciseTypes.NONE, e)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success btn-create" data-dismiss="modal">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
