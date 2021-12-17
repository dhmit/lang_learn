import React, { useContext, useState } from 'react';
import * as PropTypes from 'prop-types';

// source below
export default function VideoPlayer(props) {
    // const state = useContext(InstructorViewContext);
    // const [youtubeURL, setYoutubeURL] = useState('');
    // const [videoTitle, setVideoTitle] = useState('');
    // const [transcript, setTranscript] = useState([]);
    //
    // const modalHandler = (exerciseType, event) => {
    //     event.preventDefault();
    //     state.setShowModal(exerciseType);
    // };
    //
    // const getTranscript = async (event) => {
    //     event.preventDefault();
    //     const urlInputted = document.getElementById('youtube-url-input').value;
    //     setYoutubeURL(urlInputted);
    //
    //     const videoID = getVideoId(urlInputted).id;
    //
    //     if (videoID) {
    //         try {
    //             const response = await fetch(`/api/get_video_transcript/${videoID}`);
    //             console.log(response);
    //             const data = await response.json();
    //             setVideoTitle(data.title);
    //             setTranscript(data.transcript);
    //             console.log(data);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    //     // TODO:  handle error casE
    // };

    console.log('START TIME: ', props.start);
    console.log('END TIME: ', props.end);
    const source = `https://www.youtube.com/embed/${props.youtubeVideoID}?start=${props.start}&end=${props.end}&cc_load_policy=1&controls=0&disablekb=1`;

    return (
        <iframe
            src={source}
            frameBorder='0'
            allow='encrypted-media'
            allowFullScreen
            title='video'
            width='100%'
            height='400px'
        />);
}
VideoPlayer.propTypes = {
    youtubeVideoID: PropTypes.string,
    start: PropTypes.number,  // in seconds
    end: PropTypes.number, // in seconds
};
