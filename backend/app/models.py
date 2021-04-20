"""
Models for the lang_learn app.
"""
from django.db import models


def default_module():
    """
    List of modules with available states, default permission set to False
    """
    mods = {
        'anagrams': {
            'noun': False,
            'verb': False,
            'adjective': False,
            'adverb': False,
        },
        'flashcards': {
            'noun': False,
            'verb': False,
            'adjective': False,
            'adverb': False,
        },
        'quiz': {
            'conjugations': False,
        },
        'crossword': {
            'noun': False,
            'verb': False,
            'adjective': False,
            'adverb': False,
        },
    }
    return mods


"""
word_data is of the form:
{
    "word": {
        "images": [image_url_1, image_url2, ...],
        "examples": {
            "noun": [noun_ex_1, noun_ex_2, ...],
            "verb": [verb_ex_1, ...]
        },
        "definitions": {
            "noun": [noun_def_1, noun_def_2, ...],
            "adjective": [adjective_def_1, ...]
        },
        "chosen_image": chosen_image_url,
        "chosen_example": chosen_example,
        "chosen_definition": chosen_definition
    },
    "another_word": {...}
}
"""


class Text(models.Model):
    """
    This model will hold the piece of text that will be used to generate exercises
    such as the anagram and quiz.
    """
    content = models.TextField(max_length=5000, null=True)
    title = models.CharField(max_length=252, null=True)
    modules = models.JSONField(null=True, blank=True, default=default_module)
    word_data = models.JSONField(null=True, blank=True, default=dict)

    def get_definitions(self, word, part_of_speech=None):
        """
        :param word: the target word
        :param part_of_speech: the part of speech of the word, or None if it doesn't matter
        :return: a list of the definitions of the word for the part of speech. If
                 the part of speech is None, then the list will have definitions for
                 all parts of speech. If the word is not in the text, return an empty list
        """
        if word not in self.word_data:
            return []

        definitions = self.word_data[word]["definitions"]
        output = []
        if part_of_speech is None:
            for pos in definitions:
                output.extend(definitions[pos])
        else:
            output = definitions[part_of_speech] if part_of_speech in definitions else []

        return output

    def get_examples(self, word):
        """
        :param word: the target word that you want the examples for
        :return: a list of the examples of the target word. If the word isn't in the input text,
                 then return an empty list.
        """
        return [] if word not in self.word_data else self.word_data[word]["examples"]

    def get_image(self, word):
        """
        :param word: The target word
        :return: the chosen image url associated with the target word or an empty string if
                 the word is not part of the text
        """
        return "" if word not in self.word_data else self.word_data[word]["chosen_image"]

    def get_definition(self, word):
        """
        :param word: The target word
        :return: the chosen definition associated with the target word or an empty string if
                 the word is not part of the text
        """
        return "" if word not in self.word_data else self.word_data[word]["chosen_definition"]

    def get_example(self, word):
        """
        :param word: The target word
        :return: the chosen example associated with the target word or an empty string if
                 the word is not part of the text
        """
        return "" if word not in self.word_data else self.word_data[word]["chosen_example"]
