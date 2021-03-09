"""
Helper functions that use various aspects of the nltk library to find the part of speech,
definitions, and examples for words in the text.
"""
import re
import nltk
from nltk.corpus import wordnet as wn
from PyDictionary import PyDictionary
# find better way to download wordnet
try:
    nltk.data.find('wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

CONTRACTIONS = {
    "ain't": "am not",  # / are not",
    "aren't": "are not",  # / am not",
    "can't": "cannot",
    "can't've": "cannot have",
    "'cause": "because",
    "could've": "could have",
    "couldn't": "could not",
    "couldn't've": "could not have",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hadn't've": "had not have",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he had",  # / he would",
    "he'd've": "he would have",
    "he'll": "he will",  # he shall /
    "he'll've": "he will have",  # he shall have /
    "he's": "he is",  # he has /
    "how'd": "how did",
    "how'd'y": "how do you",
    "how'll": "how will",
    "how's": "how is",  # how has /
    "i'd": "I had",  # / I would",
    "i'd've": "I would have",
    "i'll": "I will",  # I shall /
    "i'll've": "I will have",  # I shall have /
    "i'm": "I am",
    "i've": "I have",
    "isn't": "is not",
    "it'd": "it had",  # / it would",
    "it'd've": "it would have",
    "it'll": "it will",  # it shall /
    "it'll've": "it will have",  # it shall have /
    "it's": "it is",  # it has /
    "let's": "let us",
    "ma'am": "madam",
    "mayn't": "may not",
    "might've": "might have",
    "mightn't": "might not",
    "mightn't've": "might not have",
    "must've": "must have",
    "mustn't": "must not",
    "mustn't've": "must not have",
    "needn't": "need not",
    "needn't've": "need not have",
    "o'clock": "of the clock",
    "oughtn't": "ought not",
    "oughtn't've": "ought not have",
    "shan't": "shall not",
    "sha'n't": "shall not",
    "shan't've": "shall not have",
    "she'd": "she ",  # / she would",
    "she'd've": "she would have",
    "she'll": "she will",  # she shall /
    "she'll've": "she will have",  # she shall have /
    "she's": "she is",  # she has /
    "should've": "should have",
    "shouldn't": "should not",
    "shouldn't've": "should not have",
    "so've": "so have",
    "so's": "so as",  # / so is",
    "that'd": "that would",  # / that had",
    "that'd've": "that would have",
    "that's": "that is",  # that has /
    "there'd": "there had",  # / there would",
    "there'd've": "there would have",
    "there's": "there has",  # / there is",
    "they'd": "they had",  # / they would",
    "they'd've": "they would have",
    "they'll": "they will",  # they shall /
    "they'll've": "they will have",  # they shall have /
    "they're": "they are",
    "they've": "they have",
    "to've": "to have",
    "wasn't": "was not",
    "we'd": "we had",  # / we would",
    "we'd've": "we would have",
    "we'll": "we will",
    "we'll've": "we will have",
    "we're": "we are",
    "we've": "we have",
    "weren't": "were not",
    "what'll": "what will",  # what shall /
    "what'll've": "what will have",  # what shall have /
    "what're": "what are",
    "what's": "what is",  # what has /
    "what've": "what have",
    "when's": "when is",  # when has /
    "when've": "when have",
    "where'd": "where did",
    "where's": "where has",  # / where is",
    "where've": "where have",
    "who'll": "who will",  # who shall /
    "who'll've": "who will have",  # who shall have /
    "who's": "who has",  # / who is",
    "who've": "who have",
    "why's": "why has",  # / why is",
    "why've": "why have",
    "will've": "will have",
    "won't": "will not",
    "won't've": "will not have",
    "would've": "would have",
    "wouldn't": "would not",
    "wouldn't've": "would not have",
    "y'all": "you all",
    "y'all'd": "you all would",
    "y'all'd've": "you all would have",
    "y'all're": "you all are",
    "y'all've": "you all have",
    "you'd": "you had",  # / you would",
    "you'd've": "you would have",
    "you'll": "you will",  # you shall /
    "you'll've": "you will have",  # you shall have /
    "you're": "you are",
    "you've": "you have"
}


def remove_contractions(text):
    """
    Given a piece of text, expand all of the contractions in that text
    :param text: A body of text as a string
    :return: New body of text as a string without contractions
    """
    text = text.replace('’', "'")
    text = text.replace('“', '"')
    words = text.split(' ')
    for i, word in enumerate(words):
        expanded_contraction = CONTRACTIONS.get(word.lower(), word)
        if expanded_contraction and expanded_contraction[0] != word[0]:
            expanded_contraction = word[0] + expanded_contraction[1:]
        words[i] = expanded_contraction.strip('\"')
    new_text = ' '.join(words)
    return new_text


def get_parts_of_speech_tags(text):
    """
    Tags each token in a piece of text with a part of speech code
    :param text: A body of text as a string
    :return: List of tuples containing word, part_of_speech_code
    """
    tokens = nltk.word_tokenize(text)
    return nltk.pos_tag(tokens)


tags = {
    'noun': ['NN', 'NNS', 'NNP', 'NNPS'],
    'verb': ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'],
    'adverb': ['RB', 'RBR', 'RBS'],
    'adjective': ['JJ', 'JJR', 'JJS'],
    'adposition': ['IN', 'TO', 'PRT'],
    'conjunctive': ['CC', 'CONJ'],
    'pronouns': ['PRP', 'PRON'],
    'determiner': ['DT', 'DET'],
    'numeral': ['NUM'],
    'other': ['X']
}


def get_part_of_speech_words(text, part):
    """
    Filters a piece of text by part of speech
    :param text: A body of text as a string
    :param part: The part of speech to search for in the text
    :return: List of words that match the part of speech
    """
    text = remove_contractions(text)
    part = part.lower()

    if part not in tags:
        return []

    tokens = get_parts_of_speech_tags(text)
    return [token[0] for token in tokens if token[1] in tags[part]]


def filter_pos(word_list, part):
    """
    Given a list of words, filter it by part of speech
    :param word_list: the list of words that you want to filter
    :param part: the part of speech to filter by
    :return: a new word list that is a subset of the original word list where each word has
             the part of speech `part`
    """
    token_list = nltk.pos_tag(word_list)
    return [word[0].lower() for word in token_list if word[1] in tags[part] and len(word[0]) >= 3]


def get_word_definition(word_list, pos):
    """
    Find the definitions of words from a list
    :param word_list: A list of words to get the definition of
    :param pos: The part of speech that is desired from the definitions
    :return: A dictionary of word:definition pairs
    """
    pos = pos.capitalize()
    defs = PyDictionary(*word_list)
    meanings = defs.getMeanings()
    word_def = {}
    for word, meanings in meanings.items():
        if meanings is not None and pos in meanings:
            word_def[word] = [re.sub("[()]", "", meaning) for meaning in meanings[pos]
                              if word not in meaning]
        else:
            word_def[word] = []
    return word_def


def get_word_examples(word_list, part_of_speech, text):
    """
    Find examples of words used in a sentence given a word list, the part of speech,
    and the original text
    :param word_list: A list of words to find example sentences for
    :param part_of_speech: the part of speech that you want for the examples
    :param text: the text that the words are from
    :return: A dictionary of word:list_of_examples pairs, where the examples come from
             both PyDictionary and the original text
    """
    pos_tags = {
        'noun': 'n',
        'verb': 'v',
        'adjective': 'a',
        'adverb': 'r'
    }

    word_examples = {word: [] for word in word_list}

    for word in word_list:
        syns = wn.synsets(word)
        if len(syns) > 0:
            for net in syns:
                if pos_tags[part_of_speech] != net.pos():
                    continue
                for example in net.examples():
                    if word.lower() in example.lower():
                        word_examples[word].append(example.lower())

    sentences = re.split("[?.!]", text)
    for sentence in sentences:
        for word in word_list:
            if word in sentence:
                word_examples[word].append(sentence)
    return word_examples


def punct_in_word(word):
    """
    Checks if there are punctuations in the word
    """
    quotes = ["“", '"', "'", "’", ".", "?", "!", ":", ";", "-", ","]
    for quote in quotes:
        if quote in word:
            return True
    return False


def get_valid_words(text, pos):
    """
    Retrieves all the valid words of length 3 or more with a specific part of speech from a piece
    of text
    :param text: the text that you want the words from
    :param pos: the part of speech that you want to filter by
    :return: a list of words from the piece of text that has the specified part of speech
    """
    return list(set(word.lower() for word in get_part_of_speech_words(text.lower(), pos)
                    if (not punct_in_word(word) and len(word) > 2)))
