import json
import nltk


def parse_json(file):
    pass


def sentence_feeder(text):
    """
    Given text, returns a list of sentences in the text.
    """
    return nltk.tokenize.sent_tokenize(text)

