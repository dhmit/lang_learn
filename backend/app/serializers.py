"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""
from rest_framework import serializers
from .models import (
    Text,
)


class TextSerializer(serializers.ModelSerializer):
    """
    Serializes a Text object
    """
    class Meta:
        model = Text
        fields = ['id', 'title', 'content']
