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

def rand_words(all_words, max):
    words = set()
    for i in range(max):
        indx = random.randint(0, len(all_words))
        while (words[indx] not in words):
            words.push(words[indx])
    return list(words)

def place_word_in_map(word, map, x, y, direction, current_words):
    "direction: 0 for across, 1 for down"

def make_crossword(map, words, words_left):


def get_crosswords(all_words):
    max_word_amount = 20
    if len(all_words) > max_word_amount:
        words = rand_words(all_words, max_word_amount)
    else:
        words = all_words.copy()
    words.sort(key = len, reverse = True)

    map = [[0] * 15] * 15

    rand_x = random.randint(0, 15 - len(words[0]) - 1)
    rand_y = random.randint(0, 15 - len(words[0]) - 1)
    rand_direction = randint(0, 1)
    placed_words = []
    place_word_in_map(word, map, rand_x, rand_y, rand_direction, current_words)

    make_crossword(map, placed_words, words[1:])
