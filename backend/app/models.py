"""
Models for the lang_learn app.
"""
import numpy as np
from PIL import Image

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


class Text(models.Model):
    """
    This model will hold the piece of text that will be used to generate exercises
    such as the anagram and quiz.
    """
    content = models.TextField(max_length=5000, null=True)
    title = models.CharField(max_length=252, null=True)
    modules = models.JSONField(null=True, blank=True, default=default_module)
    images = models.JSONField(null=True, blank=True, default=dict)
    examples = models.JSONField(null=True, blank=True, default=dict)
    definitions = models.JSONField(null=True, blank=True, default=dict)


class Photo(models.Model):
    """
    This model will hold the piece of text that will be used to generate exercises
    such as the anagram and quiz.
    """
    title = models.CharField(max_length=252, null=True)
    image = models.ImageField(upload_to='data/local_photos')

    def get_image_data(self):
        with self.image as image_file:
            return np.array(Image.open(image_file))
