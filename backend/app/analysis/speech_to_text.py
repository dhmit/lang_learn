import nltk
from nltk.metrics import edit_distance

def sentence_feeder(text):
    """
    Given text, returns a list of sentences in the text.
    """
    return nltk.tokenize.sent_tokenize(text)

def tokenize_sentence(sentence):
    """
    Given a sentence, return a list of words in the text.
    """
    return [word for word in nltk.tokenize.word_tokenize(sentence) if word.isalpha()]

def get_transcript_score(expected, sentence):
    expected = ' '.join(expected)
    edit_dist = edit_distance(sentence, expected)
    return int((len(expected) - edit_dist) / len(expected) * 100)
