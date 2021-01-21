"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""
import json
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
        fields = ['title', 'text']


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializes a Student object
    """
    class Meta:
        model = Text
        fields = ['name', 'username', 'password']


class InstructorSerializer(serializers.ModelSerializer):
    """
    Serializes an Instructor object
    """
    class Meta:
        model = Text
        fields = ['name', 'username', 'password']


class LeaderboardSerializer(serializers.ModelSerializer):
    """
    Serializes a Leaderboard object
    """
    class Meta:
        model = Text
        fields = ['student', 'score', 'category']
