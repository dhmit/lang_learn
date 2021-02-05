"""
Models for the lang_learn app.
"""
from django.db import models


class Text(models.Model):
    """
    This model will hold the piece of text that will be used to generate exercises
    such as the anagram and quiz.
    """
    content = models.TextField(max_length=5000, null=True)
    title = models.CharField(max_length=252, null=True)
    images = models.JSONField(null=True, blank=True, default=dict)
    examples = models.JSONField(null=True, blank=True, default=dict)
    definitions = models.JSONField(null=True, blank=True, default=dict)
