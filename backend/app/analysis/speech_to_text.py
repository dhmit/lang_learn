import json
import nltk


def parse_json(file):
    pass


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
