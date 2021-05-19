"""
Error function used to create a new question option with a comma splice error
"""
from nltk.tokenize import sent_tokenize


def apply(question_option):
    """
    Creates a new option (dict) that has text with a comma splice error.
    :param question_option:
    :return:
    """
    # split answer up into sentences
    sentences = sent_tokenize(question_option['text'])

    # comma splice error can only be induced if text is more than one sentence
    if len(sentences) == 1:
        return question_option, False

    for i, sentence in enumerate(sentences):
        # remove ending punctuation mark
        if i != len(sentences) - 1:
            sentence = sentence[0:len(sentence) - 1]
        if i != 0:
            sentence = sentence[0].lower() + sentence[1:]
        sentences[i] = sentence

    splice_error_text = ', '.join(sentences)

    new_question_option = {
        'error-types': question_option['error-types'] + ['comma-splice'],
        'text': splice_error_text
    }

    return new_question_option, True
