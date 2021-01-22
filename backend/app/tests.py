"""
Tests for the main app.
"""

from django.test import TestCase

from app.quiz_creation import conjugation_quiz


class MainTests(TestCase):
    """
    Backend TestCase
    """
    # def setUp(self):
    #     super().setUp()
    #     do any setup here

    def test_sample(self):
        """
        Remove me once we have real tests here.
        """
        two = 2
        another_two = 2
        self.assertEqual(two + another_two, 4)

    def test_verb_conjugations(self):
        """
        Testing if the correct verbs are derived from the infinitive form.
        """
        verb1 = conjugation_quiz.find_infinitive_form("running")
        verb2 = conjugation_quiz.find_infinitive_form("swam")
        verb3 = conjugation_quiz.find_present_tense("painted")
        verb4 = conjugation_quiz.find_present_tense("dancing")
        self.assertEqual("run", verb1)
        self.assertEqual("swim", verb2)
        self.assertEqual("paint", verb3)
        self.assertEqual("dance", verb4)
