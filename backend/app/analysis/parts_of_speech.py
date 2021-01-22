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


tags = {
        'noun': ['NN', 'NNS', 'NNP', 'NNPS'],
        'verb': ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'],
        'adverb': ['RB', 'RBR', 'RBS'],
        'adjective': ['JJ', 'JJR', 'JJS']
    }


def get_part_of_speech_words(text, part):
    part = part.lower()

    if part not in tags:
        return "Part of speech not valid"

    tokens = get_parts_of_speech_tags(text)
    return [token[0] for token in tokens if token[1] in tags[part]]


def filter_pos(word_list, part):
    token_list = nltk.pos_tag(word_list)
    return [word[0] for word in token_list if word[1] in tags[part]]


def get_word_definition(word_list):
    word_def = {}
    for word in word_list:
        syns = wn.synsets(word)
        if len(syns) > 0:
            word_def[word] = syns[0].definition()
        else:
            word_def[word] = ''
    return word_def


def get_word_examples(word_list):
    word_examples = {}
    for word in word_list:
        syns = wn.synsets(word)
        if len(syns) > 0:
            word_examples[word] = syns[0].examples()
        else:
            word_examples[word] = ''

    return word_examples
