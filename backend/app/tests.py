"""
Tests for the main app.
"""

from django.test import TestCase
from app.analysis import parts_of_speech


class MainTests(TestCase):
    """
    Backend TestCase
    """

    # def setUp(self):
    #     super().setUp()
    #     do any setup here

    def test_sample(self):
        """
        Remove me once we have real tests here.
        """
        two = 2
        another_two = 2
        self.assertEqual(two + another_two, 4)

    def test_word_def(self):
        """
        Checks if correct definitions are outputted
        """
        def_dict_1 = parts_of_speech.get_word_definition(["hello", "happy"])
        def_dict_2 = parts_of_speech.get_word_definition(["word", "boat", "sky"])
        self.assertEqual({'hello': 'an expression of greeting',
                          'happy': 'enjoying or showing or marked by joy or pleasure'}
                         , def_dict_1)
        self.assertEqual({'word': 'a unit of language that native speakers can identify',
                          'boat': 'a small vessel for travel on water',
                          'sky': 'the atmosphere and outer space as viewed from the earth'}
                         , def_dict_2)

    def test_word_examples(self):
        """
        Checks if correct examples are outputted
        """
        example_dict_1 = parts_of_speech.get_word_examples(["hello", "happy"])
        example_dict_2 = parts_of_speech.get_word_examples(["word", "boat", "sky"])
        self.assertEqual({'hello': ['every morning they exchanged polite hellos'],
                          'happy': ['a happy smile', 'spent many happy days on the beach',
                                    'a happy marriage']}
                         , example_dict_1)
        self.assertEqual({'word': ['words are the blocks from which sentences are made',
                                   'he hardly said ten words all morning'],
                          'boat': [],
                          'sky': []}
                         , example_dict_2)
