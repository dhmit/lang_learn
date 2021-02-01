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
        expected_1 = ["testing", "test", "tested", "ran"]
        word_2 = "Expect"
        options_2 = conjugation_quiz.get_sentence_options(word_2)
        expected_2 = ["Expect", "Expected", "Expecting", "Expects"]
        self.assertEqual(len(options_1), 4)
        self.assertIn(word_1, options_1)
        for i in range(4):
            self.assertEqual(options_1[i][0].isupper(), expected_1[i][0].isupper())
        self.assertEqual(len(options_2), 4)
        self.assertIn(word_2, options_2)
        for i in range(4):
            self.assertEqual(options_2[i][0].isupper(), expected_2[i][0].isupper())

    # def test_is_anagram(self):
    #     """
    #     Tests the function is_anagram from anagrams.py
    #     """
    #     has_anagrams = ["synthesize", "sent", "hints"]
    #     not_anagrams = ["about", "sysnets", "from"]
    #     letters = {'s': 2, 'y': 1, 'n': 1, 't': 1, 'h': 1, 'e': 2, 'i': 1, 'z': 1}
    #     for word in has_anagrams:
    #         word_freq = anagrams.get_letter_freq(word)
    #         self.assertTrue(anagrams.is_anagram(word_freq, letters))
    #     for word in not_anagrams:
    #         word_freq = anagrams.get_letter_freq(word)
    #         self.assertFalse(anagrams.is_anagram(word_freq, letters))
