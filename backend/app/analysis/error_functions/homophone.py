"""
Error function used to create a new question option with a homophone error
"""
import random

import similar_sounding_words

from nltk.tokenize import sent_tokenize


def apply(question_option):
    """
    Creates a new question option, but replacing one of the words with a homophone
    :param question_option:
    :return: dict new question option with homophone error
    """
    applied = False
    # split text into sentences
    sentences = sent_tokenize(question_option['text'])

    # randomly select a sentence
    selected_sentence_index = random.randint(0, len(sentences) - 1)
    selected_sentence = sentences[selected_sentence_index]

    # replace a word with a homophone the first chance there is
    words = selected_sentence.split()
    for word_index, word in enumerate(words):
        if word in similar_sounding_words.index:
            replacement = random.choice(similar_sounding_words.index[word])
            words[word_index] = replacement
            applied = True
            break
    # create a new sentence and set it to be a part of sentences
    new_sentence = ' '.join(words)
    sentences[selected_sentence_index] = new_sentence

    # return new question option if error was applied, else the original
    if not applied:
        return question_option, False
    return {
               'error-types': question_option['error-types'] + ['homophone'],
               'text': ' '.join(sentences)
           }, True
