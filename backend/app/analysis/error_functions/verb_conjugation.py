"""
Error function used to create a new question option with a verb conjugation error
"""
import random
from app.quiz_creation.conjugation_quiz import get_quiz_sentences


def apply(question_option):
    """
    Creates a new option (dict) that has text with a verb conjugation error.
    :param question_option: dict
    """
    # Use convert the option text into a sentence struct to get fill-in text and erroneous verb
    # substitutions.
    text_sentences = get_quiz_sentences(question_option['text'])
    # If a verb was not found in the sentence, return original and indicate that introducing
    # the error failed.
    if len(text_sentences) == 0:
        return question_option, False
    text_sentence = text_sentences[0]

    # Remove the answer from the sentence option (to randomly pick from the other incorrect ones)
    text_sentence['options'].remove(text_sentence['answer'])

    # Set the new text to the sentence text with the fill-in replaced with a random incorrect option
    # Add the verb-conjugation error to the question's error types
    new_question_option = {
        'error-types': question_option['error-types'] + ['verb-conjugation'],
        'text': text_sentence['sentence'].replace(
            '___', random.choice(text_sentence['options'])
        ),
    }
    return new_question_option, True
