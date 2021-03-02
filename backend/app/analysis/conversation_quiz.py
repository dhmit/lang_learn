import os
from django.conf import settings
import copy

"""
Parsing text:
Take in string of question and answers, each separated by '\n'

Send question to frontend

option = {
    'error-types':[strings reprenting error types],
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
    for i in range(len(q_and_a) // 2):
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
