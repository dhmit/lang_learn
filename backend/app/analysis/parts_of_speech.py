import nltk

# find better way to download wordnet
try:
    nltk.data.find('wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)
from nltk.corpus import wordnet as wn

# Need to implement a better system of expanding contractions,
# contractions and pycontractions both fail to install

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
    words = text.split(' ')
    for i, word in enumerate(words):
        expanded_contraction = CONTRACTIONS.get(word.lower(), word)

        if expanded_contraction[0] != word[0]:
            expanded_contraction = word[0] + expanded_contraction[1:]

        words[i] = expanded_contraction

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


def get_part_of_speech_words(text, part):
    """
    Filters a piece of text by part of speech
    :param text: A body of text as a string
    :param part: The part of speech to search for in the text
    :return: List of words that match the part of speech
    """
    text = remove_contractions(text)
    part = part.lower()
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
    """
    Find the definitions of words from a list
    :param word_list: A list of words to get the definition of
    :return: A dictionary of word:definition pairs
    """
    word_def = {}
    for word in word_list:
        syns = wn.synsets(word)
        if len(syns) > 0:
            word_def[word] = syns[0].definition()
        else:
            word_def[word] = ''
    return word_def


def get_word_examples(word_list):
    """
    Find examples of words used in a sentence given a word list
    :param word_list: A list of words to find example sentences for
    :return: A dictionary of word:list_of_examples pairs
    """
    # Entering the word 'the' causes an error
    word_examples = {}
    for word in word_list:
        syns = wn.synsets(word)
        if len(syns) > 0:
            word_examples[word] = syns[0].examples()
        else:
            word_examples[word] = ''

    return word_examples
