"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""
from rest_framework import serializers
from app.analysis import yolo_model
from .models import (
    Text,
    Photo,
)


class TextSerializer(serializers.ModelSerializer):
    """
    Serializes a Text object
    """

    class Meta:
        model = Text
        fields = ['id', 'title', 'content', 'modules']


class PhotoSerializer(serializers.ModelSerializer):
    """
    Serializes a Photo object
    """
    objects = serializers.SerializerMethodField()

    @staticmethod
    def get_objects(instance):
        return yolo_model.analyze(instance)

    class Meta:
        model = Photo
        fields = ['id', 'title', 'image', 'objects']
