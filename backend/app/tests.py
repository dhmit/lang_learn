"""
Tests for the main app.
"""

from textwrap import dedent
from django.test import TestCase

from app.analysis import anagrams, conversation_quiz
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

    def test_get_quiz_questions(self):
        test_text = """
        Hello, how are you today?
        I am doing well. How are you?
        """
        questions = conversation_quiz.get_quiz_questions(dedent(test_text))
        expected = [{
            'question': 'Hello, how are you today?',
            'options': [
                {'error-types': [], 'text': 'I am doing well. How are you?'},
                {'error-types': [], 'text': 'I am doing well. How are you?'},
                {'error-types': [], 'text': 'I am doing well. How are you?'},
                {'error-types': [], 'text': 'I am doing well. How are you?'},
            ],
            'answer': 0,
        }]
        self.assertEqual(questions, expected)

    # def test_apply_question_option_errors(self):
    #     questions[{}]
