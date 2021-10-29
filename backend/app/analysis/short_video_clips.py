"""
Helper functions used to get information of videos from URLs such as its 
transcript and title
"""
import isodate
import os
import time

import googleapiclient.discovery
from youtube_transcript_api import YouTubeTranscriptApi

api_service_name = "youtube"
api_version = "v3"
DEVELOPER_KEY = "AIzaSyCwwNqx7_HiX_KvxOGckFI9JxMy7LqdK2s"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey = DEVELOPER_KEY)

def get_video_data(video_id):
    """
    Given an id of a video, gets its title and transcript in an interval format

    :param video_id: ID of video
    :return: A dictionary with title and transcript of video with ID video_id
    """
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    request = youtube.videos().list(
        id=video_id,
        part="snippet,contentDetails",
        fields="items/snippet/title,items/contentDetails/duration",
    )
    response_data = request.execute()['items'][0]
    title = response_data['snippet']['title']
    duration = response_data['contentDetails']['duration']

    timedelta_dur = isodate.parse_duration(duration)
    dur_seconds = int(timedelta_dur.total_seconds())
    end_timestamp = timestamp_format(dur_seconds)

    return { 
        'title': title,
        'transcript': transcript_intervals_format(transcript, end_timestamp),
    }


def create_transcript_snippet(start, end, text):
    """
    Generate a snippet given the start, end, and text of a transcript interval

    :param start: Start time of transcript interval
    :param end: End time of transcript interval
    :param text: Text content of transcript interval
    :return: A dictionary with the start/end times and text content of transcript interval
    """
    return {
            'start': start,
            'end': end,
            'text': text,
        }


def transcript_intervals_format(transcript, end_timestamp):
    """
    Given a video transcript and last timestamp, format transcript content into intervals

    :param transcript: Video transcript
    :param end_timestamp: Last timestamp on video
    :return: List of dictionaries that represent an interval of video transcript
    """
    intervals = []
    for i in range(len(transcript)-1):
        start, end = round(transcript[i]['start']), round(transcript[i+1]['start'])
        text = transcript[i]['text']
        snippet = create_transcript_snippet(
            timestamp_format(start), timestamp_format(end), text
        )
        intervals.append(snippet)

    # Add final interval through YouTube API call because duration is 
    # not accurate from captions transcript through the "dur" attribute
    prev_end = intervals[-1]['end']
    end_text = transcript[-1]['text']
    end_snippet = create_transcript_snippet(prev_end, end_timestamp, end_text)
    intervals.append(end_snippet)

    return intervals


def timestamp_format(duration):
    """
    Given a duration in seconds, formats time to MM:SS

    :param duration: duration of
    :return: String of time duration formatted as MM:SS
    """
    return time.strftime('%M:%S', time.gmtime(duration))
