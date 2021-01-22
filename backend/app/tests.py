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


    def test_get_part_of_speech_words(self):
        text_1 = "Sally shouldn't sell sea shells by the sea shore."
        

    def test_word_def(self):
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
        example_dict_1 = parts_of_speech.get_word_definition(["hello", "happy"])
        example_dict_2 = parts_of_speech.get_word_definition(["word", "boat", "sky"])
        self.assertEqual({'hello': ['every morning they exchanged polite hellos'],
                          'happy': ['a happy smile', 'spent many happy days on the beach',
                                    'a happy marriage']}
                         , example_dict_1)
        self.assertEqual({'word': ['words are the blocks from which sentences are made',
                                   'he hardly said ten words all morning'],
                          'boat': [],
                          'sky': []}
                         , example_dict_2)
