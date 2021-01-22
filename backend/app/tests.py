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
        """
        Tests the get_part_of_speech_words function. It checks that the function
        tokenizes extracts the correct parts of speech from the text.
        """
        text_1 = "John shouldn't suspiciously sell small, fragile sea shells by the very blue "\
                 + "and openly mucky sea shore."
        solution_1 = {'sea', 'shells', 'shore', "John"}
        solution_2 = {'sell'}
        solution_3 = {'small', 'fragile', 'mucky', 'blue'}
        solution_4 = {'suspiciously', 'very', 'openly', 'not'}
        self.assertEqual(solution_1,
                         set(parts_of_speech.get_part_of_speech_words(text_1, 'noun')))
        self.assertEqual(solution_2,
                         set(parts_of_speech.get_part_of_speech_words(text_1, 'verb')))
        self.assertEqual(solution_3,
                         set(parts_of_speech.get_part_of_speech_words(text_1, 'adjective')))
        self.assertEqual(solution_4,
                         set(parts_of_speech.get_part_of_speech_words(text_1, 'adverb')))

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
