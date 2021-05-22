"""
Tests for the main app.
"""
import copy
from textwrap import dedent

from django.test import TestCase

from app.analysis import anagrams, crosswords, conversation_quiz, error_functions
from app.quiz_creation import conjugation_quiz


class MainTests(TestCase):
    """
    Backend TestCase
    """

    # def setUp(self):
    #     super().setUp()

    def test_letter_freq(self):
        """
        Tests the function letter_freq from anagrams.py
        """
        word_1 = "synthesize"
        freq_1 = {'s': 2, 'y': 1, 'n': 1, 't': 1, 'h': 1, 'e': 2, 'i': 1, 'z': 1}
        word_2 = "aAbBcCdDeE"
        freq_2 = {'a': 2, 'b': 2, 'c': 2, 'd': 2, 'e': 2}
        self.assertEqual(anagrams.get_letter_freq(word_1), freq_1)
        self.assertEqual(anagrams.get_letter_freq(word_2), freq_2)

    def test_is_anagram(self):
        """
        Tests the function is_anagram from anagrams.py
        """
        has_anagrams = ["synthesize", "sent", "hints"]
        not_anagrams = ["about", "sysnets", "from"]
        letters = {'s': 2, 'y': 1, 'n': 1, 't': 1, 'h': 1, 'e': 2, 'i': 1, 'z': 1}
        for word in has_anagrams:
            word_freq = anagrams.get_letter_freq(word)
            self.assertTrue(anagrams.is_anagram(word_freq, letters))
        for word in not_anagrams:
            word_freq = anagrams.get_letter_freq(word)
            self.assertFalse(anagrams.is_anagram(word_freq, letters))

    def test_get_anagrams(self):
        """
        Tests the function get_anagrams from anagrams.py
        """
        word_1 = "opened"
        some_anagrams_1 = {"pen", "den", "need", "nope", "dope"}
        all_anagrams_1 = anagrams.get_anagrams(anagrams.get_letter_freq(word_1))
        self.assertTrue(some_anagrams_1.issubset(all_anagrams_1))

        word_2 = "django"
        some_anagrams_2 = {"dog", "go", "nog", "god"}
        all_anagrams_2 = anagrams.get_anagrams(anagrams.get_letter_freq(word_2))
        self.assertTrue(some_anagrams_2.issubset(all_anagrams_2))

    def test_get_sentence_options(self):
        """
        Tests the function get_sentence_options from conjugation_quiz.py
        """
        word_1 = "testing"
        options_1 = conjugation_quiz.get_sentence_options(word_1)
        self.assertEqual(type(options_1), list)
        expected_1 = ["testing", "test", "tested", "ran"]
        word_2 = "Expect"
        options_2 = conjugation_quiz.get_sentence_options(word_2)
        self.assertEqual(type(options_2), list)
        expected_2 = ["Expect", "Expected", "Expecting", "Expects"]

        # Check that there are duplicate choices
        seen_options_1 = []
        for option in options_1:
            self.assertNotIn(option, seen_options_1)
            seen_options_1.append(option)
        seen_options_2 = []
        for option in options_2:
            self.assertNotIn(option, seen_options_2)
            seen_options_2.append(option)

        # Check that there are 4 choices
        self.assertEqual(len(options_1), 4)
        self.assertEqual(len(options_2), 4)

        # Check that the original word is a choice
        self.assertIn(word_1, options_1)
        self.assertIn(word_2, options_2)

        # Check that the capitalization of the choices is consistent
        for i in range(4):
            self.assertEqual(options_1[i][0].isupper(), expected_1[i][0].isupper())
        for i in range(4):
            self.assertEqual(options_2[i][0].isupper(), expected_2[i][0].isupper())

    def test_get_quiz_sentences(self):
        """
        Tests the function get_quiz_sentences from conjugation_quiz.py
        """
        test_texts = ['Test text used for testing quiz sentences function.', 'Word.', '']
        for text in test_texts:
            quiz_sentences = conjugation_quiz.get_quiz_sentences(text)

            self.assertEqual(type(quiz_sentences), list)

            for sentence in quiz_sentences:
                self.assertEqual(type(sentence), dict)
                self.assertIn('answer', sentence)
                self.assertEqual(type(sentence['answer']), str)
                self.assertIn('sentence', sentence)
                self.assertIn('___', sentence['sentence'])
                self.assertIn('options', sentence)
                self.assertEqual(type(sentence['options']), list)

    def test_crossword(self):
        """
        Tests the function make_crossword
        """
        words = ["technology", "strawberry"]
        crossword_output, clues = crosswords.make_crossword(words)
        solution = [['s', 't', 'r', 'a', 'w', 'b', 'e', 'r', 'r', 'y', 0, 0, 0, 0, 0],
                    [0, 'e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'c', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'h', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'n', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'o', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'l', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'o', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'g', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 'y', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        self.assertEqual(crossword_output, solution)

        words_2 = ["embezzle", "blackjack", "strawberries"]
        crossword_output = crosswords.make_crossword(words_2)
        solution_2 = [['s', 't', 'r', 'a', 'w', 'b', 'e', 'r', 'r', 'i', 'e', 's', 0, 0, 0],
                      [0, 0, 0, 0, 0, 'l', 0, 0, 0, 0, 'm', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'a', 0, 0, 0, 0, 'b', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'c', 0, 0, 0, 0, 'e', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'k', 0, 0, 0, 0, 'z', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'j', 0, 0, 0, 0, 'z', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'a', 0, 0, 0, 0, 'l', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'c', 0, 0, 0, 0, 'e', 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 'k', 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        self.assertEqual(crossword_output[0], solution_2)

        self.assertEqual(crosswords.is_valid(solution, 'colon', (5, 0), 'across', clues), True)
        self.assertEqual(crosswords.is_valid(solution, 'colon', (0, 1), 'across', clues), False)
        self.assertEqual(crosswords.is_valid(solution, 'colon', (1, 3), 'across', clues), False)
        self.assertEqual(crosswords.is_valid(solution, 'answer', (0, 3), 'down', clues), True)
        self.assertEqual(crosswords.is_valid(solution, 'rotation', (0, 2), 'down', clues), False)
        self.assertEqual(crosswords.is_valid(solution, 'colon', (-3, 4), 'down', clues), False)
        self.assertEqual(crosswords.is_valid(solution, 'colon', (14, 4), 'down', clues), False)

    def test_apply_question_option_errors(self):
        """
        Tests the apply_question_option_errors from conversation quiz
        """
        test_text = """
        Hello, how are you today?
        I am doing well. How are you?
        """
        questions = conversation_quiz.get_quiz_questions(dedent(test_text))
        self.assertEqual(len(questions), 1)
        question = questions[0]
        expected = {
            'question': 'Hello, how are you today?',
            'options': [
                {'error-types': [], 'text': 'I am doing well. How are you?'},
                {'error-types': [], 'text': 'random mutation 1'},
                {'error-types': [], 'text': 'random mutation 2'},
                {'error-types': [], 'text': 'random mutation 3'},
            ],
            'answer': 'I am doing well. How are you?',
        }
        # All questions should have a question string, options, and an answer string
        self.assertEqual(set(question.keys()), set(expected.keys()))
        # All questions should have exactly 4 options
        self.assertEqual(len(question['options']), 4)
        # All question options should be unique and one must be equal to the answer text
        num_eq_to_answer = 0
        for i in range(len(question['options'])):
            if i < 3:
                self.assertNotEqual(
                    question['options'][i]['text'],
                    question['options'][i + 1]['text']
                )
            num_eq_to_answer += (question['options'][i]['text'] == expected['answer'])
        self.assertEqual(num_eq_to_answer, 1)

    def test_error_functions(self):
        """
        General test for error functions used in apply_question_option_errors
        """
        err_funcs = [
            error_functions.capitalization,
            error_functions.comma_splice,
            error_functions.homophone,
            error_functions.run_on,
            error_functions.verb_conjugation,
            error_functions.verb_deletion
        ]
        options = [
            {'error-types': [], 'text': 'I am doing well. How are you?'},
            {'error-types': ['comma-splice'],
             'text': 'I will go to the park later, i will also go to the store.'},
            {'error-types': [],
             'text': 'I will go to the park later. I will also go to the store.'},
            {'error-types': [], 'text': 'Did you hear their performance?'},
            {'error-types': [], 'text': 'I run outside when the weather is nice.'}
        ]
        original_options = copy.deepcopy(options)
        for error_function in err_funcs:
            for option, original_option in zip(options, original_options):
                new_option, success = error_function.apply(option)
                # The original option error-types should not be mutated
                self.assertDictEqual(option, original_option)
                # No duplicates in error-types
                self.assertEqual(
                    len(new_option['error-types']), len(set(new_option['error-types']))
                )
                if success:
                    # If the error was successfully applied, the text must be different and there
                    # should also be a new error type in error-types
                    self.assertNotEqual(new_option['text'], option['text'])
                    self.assertEqual(len(new_option['error-types']), len(option['error-types']) + 1)
                    self.assertEqual(
                        len(set(new_option['error-types']) ^ set(option['error-types'])), 1
                    )
                else:
                    # If application of the error failed, the new option text should be equal to the
                    # original text and error-types should not be changed
                    self.assertEqual(new_option['text'], option['text'])
                    self.assertEqual(new_option['error-types'], option['error-types'])

    def test_capitalization(self):
        """
        Test capitalization error function
        """
        option_1 = {'error-types': [], 'text': 'I am doing well. How are you?'}
        new_option_1, success = error_functions.capitalization.apply(option_1)
        if success:  # If the error was applies, check that it was applied correctly
            expected_1 = [
                {'error-types': ['capitalization'], 'text': 'i am doing well. How are you?'},
                {'error-types': ['capitalization'], 'text': 'I am doing well. how are you?'}
            ]
            self.assertIn(new_option_1, expected_1)

        option_2 = {
            'error-types': ['comma-splice'],
            'text': 'I will go to the park later, I will also go to the store.'
        }
        new_option_2, success = error_functions.capitalization.apply(option_2)
        if success:
            expected_2 = {
                'error-types': ['comma-splice', 'capitalization'],
                'text': 'i will go to the park later, I will also go to the store.'
            }
            self.assertEqual(new_option_2, expected_2)

    def test_comma_splice(self):
        """
        Test comma splice error function
        """
        option_1 = {
            'error-types': [],
            'text': 'I will go to the park later. I will also go to the store.'
        }
        new_option_1, success = error_functions.comma_splice.apply(option_1)
        if success:
            expected_1 = {
                'error-types': ['comma-splice'],
                'text': 'I will go to the park later, i will also go to the store.'
            }
            self.assertEqual(new_option_1, expected_1)

    def test_homophone(self):
        """
        Test homophone error function
        """
        option_1 = {'error-types': [], 'text': 'Did you hear their performance?'}
        new_option_1, success = error_functions.homophone.apply(option_1)
        if success:
            # The first word that can be replaced with a homophone is replaced
            expected_1 = [
                {'error-types': ['homophone'], 'text': "Did yew hear their performance?"},
                {'error-types': ['homophone'], 'text': "Did ewe hear their performance?"}
            ]
            self.assertIn(new_option_1, expected_1)

    def test_run_on(self):
        """
        Test run-on sentence error function
        """
        option_1 = {
            'error-types': [],
            'text': 'I will go to the park later. I will also go to the store.'
        }
        new_option_1, success = error_functions.run_on.apply(option_1)
        if success:
            expected_1 = {
                'error-types': ['run-on'],
                'text': 'I will go to the park later i will also go to the store.'
            }
            self.assertEqual(new_option_1, expected_1)

    def test_verb_error_func(self):
        """
        Test for error functions that use get_quiz_sentences from conjugation quiz to produce
        verb-related errors
        """
        option = {'error-types': [], 'text': 'I run outside when the weather is nice.'}
        verb_error_funcs = [
            error_functions.verb_conjugation,
            error_functions.verb_deletion
        ]
        for error_function in verb_error_funcs:
            new_option, success = error_function.apply(option)
            if not success:
                continue
            option_words = set(option['text'].split())
            new_option_1_words = set(new_option['text'].split())
            # The either 'run' or 'is' should be changed
            changed_words = option_words - new_option_1_words
            run_or_is = 'run' in changed_words or 'is' in changed_words
            self.assertTrue(run_or_is)

    def test_verb_deletion(self):
        """
        Test verb deletion error function
        """
        option_1 = {'error-types': [], 'text': 'I run outside when the weather is nice.'}
        new_option_1, success = error_functions.verb_deletion.apply(option_1)
        # The new text should be shorter than the original answer choice
        if success:
            self.assertLess(len(new_option_1['text']), len(option_1['text']))
