import os
from django.conf import settings


def get_word_set():
    word_file = os.path.join(settings.NLTK_WORD_DIR, 'en')
    with open(word_file) as file:
        word_set = set(line.strip() for line in file.readlines())
    return word_set


def get_letter_freq(letters):
    freq = {}
    for letter in letters:
        letter = letter.lower()
        cur_freq = freq.setdefault(letter, 0)
        freq[letter] = cur_freq + 1
    return freq


def is_anagram(test_freq, word_freq):
    for letter in test_freq:
        if letter not in word_freq or test_freq[letter] > word_freq[letter]:
            return False
    return True


def get_anagrams(anagram_freq):
    anagrams = set()
    word_set = get_word_set()
    for word in word_set:
        if is_anagram(get_letter_freq(word), anagram_freq):
            anagrams.add(word)
    return anagrams
