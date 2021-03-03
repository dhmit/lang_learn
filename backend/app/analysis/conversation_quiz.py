import os
import random
from django.conf import settings
import copy
import importlib

from app.quiz_creation.conjugation_quiz import get_quiz_sentences

"""
Parsing text:
Take in string of question and answers, each separated by '\n'

Send question to frontend

option = {
    'error-types':[strings representing error types],
    'text': str
}

question = {
    'question': str,
    'options': [ options ],
    'answer': int (index of correct option),
}
"""


def get_quiz_questions(text):
    """
    Given a piece of text, create a list of dictionaries (questions). The dictionaries contain a
    question string, a list of 4 dictionaries representing answer choices, and an answer index.
    :param text: A body of text as a string
    :return: List of questions (Questions are formatted as dictionaries with a question string,
    list of options, and an answer index).
    """
    text = text.strip('\n')
    q_and_a = text.split('\n')
    assert len(q_and_a) % 2 == 0, "There must be an equal number of questions and answers."
    questions = []
    for i in range(0, len(q_and_a), 2):
        answer = {
            'error-types': [],
            'text': q_and_a[i + 1],
        }
        new_question = {
            'question': q_and_a[i],
            'options': [copy.deepcopy(answer)] * 4,
            'answer': 0,
        }
        questions.append(new_question)
    return questions


def verb_conjugation_error(question_option):
    """
    Creates a new option (dict) that has text with a verb conjugation error.
    :param question_option: dict
    """
    # Use convert the option text into a sentence struct to get fill-in text and erroneous verb
    # substitutions.
    text_sentence = get_quiz_sentences(question_option['text'])[0]

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
    return new_question_option


def apply_question_errors(quiz_question):
    """
    Given a single quiz question (dict), induce a random error in 3 of its options.
    :param quiz_question:
    """
    # Get all of the error functions defined in conversation quiz (this file)
    conversation_quiz = importlib.import_module('app.analysis.conversation_quiz')
    error_functions = []
    for func in dir(conversation_quiz):
        if func[-6:] == '_error':
            error_functions.append(getattr(conversation_quiz, func))

    # Apply a random error to the last 3 options
    for i in range(1, 4):
        error_function = random.choice(error_functions)
        quiz_question['options'][i] = error_function(quiz_question['options'][i])

    # Randomize positions of the choices
    random.shuffle(quiz_question['options'])

    # Reassign question answer based on the new position of the actual answer
    for i in range(4):
        if len(quiz_question['options'][i]['error-types']) == 0:
            quiz_question['answer'] = i
            break
