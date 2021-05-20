"""
Helper functions for generating and checking anagrams
"""
import os
import random
from django.conf import settings


def get_word_set():
    """
    :return: A set of english words
    """
    word_file = os.path.join(settings.NLTK_WORD_DIR, 'en')
    with open(word_file) as file:
        word_set = set(line.strip() for line in file.readlines())
    return word_set


def scramble_word(word):
    """
    :param word: the word to scramble for single word anagrams
    :return: a string of the word with the letters scrambled
    """
    word_as_list = list(word)
    random.shuffle(word_as_list)
    return ''.join(word_as_list)


def get_letter_freq(letters):
    """
    Given a word, find the frequency of letters in this word
    :param letters: the word to find the frequency of
    :return: a dictionary that maps letters to their frequency in the word
    """
    freq = {}
    for letter in letters:
        letter = letter.lower()
        cur_freq = freq.setdefault(letter, 0)
        freq[letter] = cur_freq + 1
    return freq


def is_anagram(test_freq, word_freq):
    """
    :param test_freq: The frequency dictionary of the word you are testing
    :param word_freq: The frequency dictionary that you want the anagram of
    :return: true if the test word is an anagram
    """
    for letter in test_freq:
        if letter not in word_freq or test_freq[letter] > word_freq[letter]:
            return False
    return True


def get_anagrams(anagram_freq):
    """
    :param anagram_freq: the frequency dictionary of the scrambled letters
    :return: a set of all the anagrams
    """
    anagrams = set()
    word_set = get_word_set()
    for word in word_set:
        if is_anagram(get_letter_freq(word), anagram_freq):
            anagrams.add(word.lower())
    return anagrams
