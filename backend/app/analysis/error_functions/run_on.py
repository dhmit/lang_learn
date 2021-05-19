"""
Error function used to create a new question option with a run-on sentence
"""
import random

from nltk.tokenize import sent_tokenize


def apply(question_option):
    """
    Creates a new option (dict) that contains a run-on sentence error by removing a punctuation from
    two independent clauses
    :param: question option
    :return: question option with run on error
    """
    # Get all sentences
    sentences = sent_tokenize(question_option['text'])
    # Run ons can only occur with over 1 sentence
    if len(sentences) <= 1:
        return question_option, False
    # There is only one possible period to change for 2 sentences.
    if len(sentences) == 2:
        selected_sentence_index = 0
    else:
        # Otherwise, choose any from first to second to last
        selected_sentence_index = random.randint(0, len(sentences) - 2)
    # Get sentence at selected index
    selected_sentence = sentences[selected_sentence_index]
    # Remove the punctuation
    if selected_sentence[-1] in ['.', '?', '!']:
        new_sentence = selected_sentence.replace(selected_sentence[-1], '')
    else:
        return question_option, False
    sentences[selected_sentence_index] = new_sentence
    # Lowercase the next sentence
    next_sentence = sentences[selected_sentence_index + 1]
    new_next_sentence = next_sentence[0].lower() + next_sentence[1:]
    sentences[selected_sentence_index + 1] = new_next_sentence
    out_text = ' '.join(sentences)

    question_option_with_error = {
        'error-types': question_option['error-types'] + ['run-on'],
        'text': out_text
    }
    return question_option_with_error, True
