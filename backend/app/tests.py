"""
Tests for the main app.
"""

from django.test import TestCase
from app.analysis import anagrams


class MainTests(TestCase):
    """
    Backend TestCase
    """
    # def setUp(self):
    #     super().setUp()
    #     do any setup here

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
