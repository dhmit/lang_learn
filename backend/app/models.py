"""
Models for the lang_learn app.
"""
from django.db import models


class Text(models.Model):
    """
    This model will hold the piece of text that will be used to generate exercises
    such as the anagram and quiz.
    """
    text = models.TextField(max_length=2000, null=True)
    title = models.CharField(max_length=252, null=True)


class User(models.Model):
    """
    This model is an abstract class used for instructors and students.
    TODO: the fields are subject to change if we use something like Google Authentication
    """
    name = models.CharField(max_length=252)
    username = models.CharField(max_length=252)
    password = models.CharField(max_length=252)


class Student(User):
    """
    This model will hold the information for students
    """
    # TODO: Put some stuff for students here


class Instructor(User):
    """
    This model will hold the information for instructor
    """
    # TODO: Put some stuff for instructor here


class Leaderboard(models.Model):
    """
    This model will hold information for the scores that students have for different exercises.
    """
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)
    score = models.IntegerField(null=True)
    category = models.CharField(max_length=252, null=True)
