"""
Models for the lang_learn app.
"""
from django.db import models


def default_module():
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
        }
    }
    return mods


class Text(models.Model):
    """
    This model will hold the piece of text that will be used to generate exercises
    such as the anagram and quiz.
    """
    text = models.TextField(max_length=5000, null=True)
    title = models.CharField(max_length=252, null=True)
    modules = models.JSONField(null=True, blank=True, default=default_module())
