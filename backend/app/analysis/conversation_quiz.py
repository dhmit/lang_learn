import os
import random
import copy
import importlib
from django.conf import settings

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
            'text': q_and_a[i + 1].strip(' '),
        }
        new_question = {
            'question': q_and_a[i].strip(' '),
            'options': [copy.deepcopy(answer)] * 4,
            'answer': q_and_a[i + 1].strip(' '),
        }
        questions.append(new_question)
    return questions


def apply_question_option_errors(quiz_question):
    """
    Given a single quiz question (dict), induce a random error in 3 of its options.
    :param quiz_question:
    """
    # Get all of the error functions defined in error_functions
    usable_functions = []
    for error_name in os.listdir(settings.ERROR_FUNCTIONS_DIR):
        error_name, _ = os.path.splitext(error_name)
        try:
            error_function = importlib.import_module(
                f'.{error_name}', package='app.analysis.error_functions'
            )
            if hasattr(error_function, 'apply'):
                usable_functions.append(error_function)
        except ModuleNotFoundError:
            print(f'{error_name} error is not available.')

    # Apply a random error to the last 3 options
    seen_choices = {quiz_question['options'][0]['text'], }
    for i in range(1, 4):
        untested_functions = usable_functions.copy()
        error_applied = False
        # Try to produce an error in the option
        while not error_applied:
            if len(untested_functions) == 0:
                raise Exception(f"There are no functions available that can produce an error in "
                                f"question: {quiz_question['question']}")
            random.shuffle(untested_functions)
            error_function = untested_functions.pop(-1)
            quiz_question['options'][i], error_applied = error_function.apply(
                quiz_question['options'][i]
            )
            new_text = quiz_question['options'][i]['text']
            error_applied = error_applied and new_text not in seen_choices
            seen_choices.add(new_text)

    # Randomize positions of the choices
    random.shuffle(quiz_question['options'])
