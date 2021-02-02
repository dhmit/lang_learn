"""
Tests for the main app.
"""

from django.test import TestCase
from app.models import Text

from app.quiz_creation import conjugation_quiz


class MainTests(TestCase):
    """
    Backend TestCase
    """

    # def setUp(self):
    #     super().setUp()

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
        self.assertEqual(len(options_1), 4)
        self.assertIn(word_1, options_1)
        for i in range(4):
            self.assertEqual(options_1[i][0].isupper(), expected_1[i][0].isupper())
        self.assertEqual(len(options_2), 4)
        self.assertIn(word_2, options_2)
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
