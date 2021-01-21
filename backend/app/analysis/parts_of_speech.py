import nltk

# find better way to download wordnet
try:
    nltk.data.find('wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)
from nltk.corpus import wordnet as wn


def get_parts_of_speech_tags(text):
    tokens = nltk.word_tokenize(text)
    return nltk.pos_tag(tokens)


def get_part_of_speech_words(text, part):
    tags = {
        'noun': ['NN', 'NNS', 'NNP', 'NNPS'],
        'verb': ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'],
        'adverb': ['RB', 'RBR', 'RBS'],
        'adjective': ['JJ', 'JJR', 'JJS']
    }

    if part not in tags:
        return "Part of speech not valid"

    tokens = get_parts_of_speech_tags(text)
    return [token[0] for token in tokens if token[1] in tags[part]]


def get_word_definition(word_list):
    word_def = {}
    for word in word_list:
        syns = wn.synsets(word)
        word_def[word] = syns[0].definition()
    return word_def


def get_word_examples(word_list):
    word_examples = {}
    for word in word_list:
        syns = wn.synsets(word)
        word_examples[word] = syns[0].examples()
    return word_examples

