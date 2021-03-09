"""
Helper functions for generating and checking anagrams
"""
import os
import random
# Standard imports
import argparse

# Custom imports
from app.analysis import file_ops

from app.analysis.grid_generator import GridGenerator

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
    """
    :param all_words: list of words to be in crossword
    :param max: number of words wanted in crossword
    :return: list of max amt of random words from all_words
    """
    words = set()
    for i in range(max + 1):
        indx = random.randint(0, len(all_words)-1)
        while all_words[indx] not in words:
            words.add(all_words[indx])
    return list(words)


# def place_word_in_map(word, map, x, y, direction, current_words):
#     "direction: 0 for across, 1 for down"


def parse_cmdline_args():
    """ Uses argparse to get commands line args.
    """
    parser = argparse.ArgumentParser(description='Generate a crossword puzzle.')
    parser.add_argument('-f', type=str,
                        default="words.txt",
                        dest="word_file",
                        help="A file containing words, one word per line.")
    parser.add_argument('-d', type=int,
                        nargs="+",
                        default=[20, 20],
                        dest="dim",
                        help="Dimensions of the grid to build.")
    parser.add_argument('-n', type=int,
                        default=2,
                        dest="n_loops",
                        help="NUmber of execution loops to run.")
    parser.add_argument('-t', type=int,
                        default=10,
                        dest="timeout",
                        help="Maximum execution time, in seconds, per execution loop.")
    parser.add_argument('-o', type=float,
                        default=1.0,
                        dest="target_occ",
                        help="Desired occupancy of the final grid. Default is 1.0, which just uses all of the allotted time.")
    parser.add_argument('-p', type=str,
                        default="out.pdf",
                        dest="out_pdf",
                        help="Name of the output pdf file.")
    parser.add_argument('-a', type=str,
                        default="basic",
                        dest="algorithm",
                        help="The algorithm to use.")

    return parser.parse_args()


def create_generator(algorithm, word_list, dimensions, n_loops, timeout, target_occupancy):
    """ Constructs the generator object for the given algorithm.
    """
    algorithm_class_map = {"basic": GridGenerator}

    try:
        return algorithm_class_map[algorithm](word_list, dimensions, n_loops, timeout,
                                              target_occupancy)
    except KeyError:
        print("Could not create generator object for unknown algorithm: {}.".format(algorithm))


def make_crossword(words, size):
    # Parse args
    args = parse_cmdline_args()

    # Construct the generator object
    dim = args.dim if len(args.dim) == 2 else [args.dim[0], args.dim[0]]
    print(dim)
    print(type(dim))
    generator = create_generator(args.algorithm, words, dim, args.n_loops, args.timeout,
                                 args.target_occ)
    if not generator:
        return

    # Generate the grid
    generator.generate_grid()

    grid = generator.get_grid()
    words_in_grid = generator.get_words_in_grid()
    file_ops.write_grid_to_screen(grid, words_in_grid)
    print(grid)
    print(words_in_grid)



def get_crosswords():

    all_words = ['regular', 'violent', 'rebel', 'handy', 'noxious', 'bare', 'rightful', 'chance',
                 'agonizing', 'mean', 'report', 'harmony', 'barbarous', 'rapid', 'memory',
                 'vegetable', 'excite', 'illustrious', 'burly', 'old-fashioned', 'field',
                 'seashore', 'wild', 'skate', 'temporary', 'debonair', 'forgetful', 'film',
                 'lavish', 'scary']
    max_word_amount = 20
    if len(all_words) > max_word_amount:
        words = rand_words(all_words, max_word_amount)
    else:
        words = all_words.copy()
    # words.sort(key = len, reverse = True)
    #
    # map = [[0] * 15] * 15
    #
    # rand_x = random.randint(0, 15 - len(words[0]) - 1)
    # rand_y = random.randint(0, 15 - len(words[0]) - 1)
    # rand_direction = randint(0, 1)
    # placed_words = []
    # place_word_in_map(word, map, rand_x, rand_y, rand_direction, current_words)
    #
    # make_crossword(map, placed_words, words[1:])
    grid_size = 15

    print(words)

    make_crossword(all_words, grid_size)


if __name__ == "__main__":
    print("hello")
    get_crosswords()
