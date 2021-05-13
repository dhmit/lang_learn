import nltk
import os
from pocketsphinx import AudioFile, get_model_path, get_data_path

def sentence_feeder(text):
    """
    Given text, returns a list of sentences in the text.
    """
    return nltk.tokenize.sent_tokenize(text)

def tokenize_sentence(sentence):
    """
    Given a sentence, return a list of words in the text.
    """
    return nltk.tokenize.word_tokenize(sentence)

def testing_audio_transcription():
    """
    Uses CMU Sphinx to Transcribe audio. Audio files passed in must be of .wav format.
    *** To try out download swig or else sphinx won't work http://www.swig.org/download.html***
    """
    model_path = get_model_path()
    data_path = get_data_path()

    config = {
        'verbose': False,
        'audio_file': os.path.join(data_path, 'goforward.raw'),
        'buffer_size': 2048,
        'no_search': False,
        'full_utt': False,
        'hmm': os.path.join(model_path, 'en-us'),
        'lm': os.path.join(model_path, 'en-us.lm.bin'),
        'dict': os.path.join(model_path, 'cmudict-en-us.dict')
    }

    audio = AudioFile(**config)
    for phrase in audio:
        print(phrase)




