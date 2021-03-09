"""
Helper functions for generating and checking anagrams
"""
import os
import random
import copy
# Standard imports
import argparse

# Custom imports
from app.analysis import file_ops

from app.analysis.grid_generator import GridGenerator

from django.conf import settings





def rand_words(all_words, max):
    words = set()
    for i in range(max + 1):
        indx = random.randint(0, len(all_words)-1)
        while all_words[indx] not in words:
            words.add(all_words[indx])
    return list(words)

# HELPER FUNCTIONS

def is_valid(grid, word, row, col, direction):
    """ This function determines whether a possibility is still valid in the
    given grid. (see generate_grid)
    A possibility is deemed invalid if:
     -> it extends out of bounds
     -> it collides with any word that already exists, i.e. if any of its
     elements does not match the words already in the grid;
     -> if the cell that precedes and follows it in its direction is not empty.
    The function also analyses how the word interacts with previous adjacent
    words, and invalidates the possibility of returns a list with the new
    words, if applicable.
    """

    # Boundaries
    if not is_within_bounds(len(word), row, col, direction, len(grid[0]), len(grid)):
        return False

    # Collisions
    if collides_with_existing_words(word, row, col, direction, grid):
        return False

    # Start and End
    if not ends_are_isolated(word, row, col, direction, grid):
        return False

    # If we can't find any issues, it must be okay!
    return True


def is_within_bounds(word_len, line, column, direction, grid_width, grid_height):
    """ Returns whether the given word is withing the bounds of the grid.
    """
    return (direction == "across" and column + word_len <= grid_width-1) or (direction == "down" and line + word_len <= grid_height-1)

def is_cell_free(line, col, grid):
    """ Checks whether a cell is free.
    Does not throw if the indices are out of bounds. These cases return as free.
    """
    # Negative indices are "legal", but we treat them as out of bounds.
    if line < 0 or col < 0:
        return True

    try:
        return grid[line][col] == 0
    except IndexError:
        return True

def ends_are_isolated(word, line, column, direction, grid):
    """ Returns whether the given word is isolated (blank before start and after end).
    """
    if direction == "across":
        # If the preceding space isn't empty
        if not is_cell_free(line, column-1, grid):
            return False
        # If the succeding space isn't empy
        if not is_cell_free(line, column+len(word), grid):
            return False
    if direction == "down":
        # If the preceding space isn't empty
        if not is_cell_free(line-1, column, grid):
            return False
        # If the succeding space isn't empy
        if not is_cell_free(line+len(word), column, grid):
            return False

    return True


def collides_with_existing_words(word, line, column, direction, grid):
    """ Returns whether the given word collides with an existing one.
    """
    for k, letter in enumerate(list(word)):
        if direction == "across":
            # Collisions
            if grid[line][column+k] != 0 and grid[line][column+k] != letter:
                return True
        if direction == "down":
            # Collisions
            if grid[line+k][column] != 0 and grid[line+k][column] != letter:
                return True

    return False

def add_word_to_grid(grid, word, row, col, direction):
    """ Adds a possibility to the given grid, which is modified in-place.
    (see generate_grid)
    """
    # Word is left-to-right
    if direction == "across":
        grid[row][col:len(list(word))+col] = list(word)

    # Word is top-to-bottom
    # (I can't seem to be able to use the slicing as above)
    if direction == "down":
        # for index in range(len(word)):
        #     grid[row + index][col] = word[index]
        #     print(word[index])
        #     for cur_row in grid:
        #         print(cur_row)
        for index, a in enumerate(list(word)):
            # print(a)
            grid[row+index][col] = a
            # for cur_row in grid:
            #     print(cur_row)

# def place_word_in_map(word, map, x, y, direction, current_words):
#     "direction: 0 for across, 1 for down"

def make_crossword(grid, word_list, grid_size):
    rand_row = random.randint(0, grid_size - len(word_list[0]) - 1)
    rand_col = random.randint(0, grid_size - len(word_list[0]) - 1)
    if random.randint(0, 1):
        rand_direction = "across"
    else:
        rand_direction = "down"
    print("row: ", rand_row, "col: ", rand_col, "direction: ", rand_direction, "word: ",
          word_list[0])
    for cur_row in grid:
        print(cur_row)
    print()
    if is_valid(grid, word_list[0], rand_row, rand_col, rand_direction):
        add_word_to_grid(grid, word_list[0], rand_row, rand_col, rand_direction)
        for cur_row in grid:
            print(cur_row)
        print()
        # print(grid)
        final_grid = find_possible_grid(grid, word_list[1:], grid_size) #might have bug of only having one item in list
        return final_grid
    return None

def find_possible_grid(grid, word_list, grid_size):
    if len(word_list) == 0:
        return grid

    current_word = word_list[0]
    possible = [] #((i,j), direction)
    for let_indx, let in enumerate(current_word):
        for i in range(grid_size):
            for j in range(grid_size):
                if grid[i][j] == let:
                    possible.append( ((i, j - let_indx), "across") )
                    possible.append( ((i - let_indx, j), "down") )
    for pos in possible:
        new_grid = copy.deepcopy(grid)
        if is_valid(grid, current_word, pos[0][0], pos[0][1], pos[1]):
            add_word_to_grid(new_grid, current_word, pos[0][0], pos[0][1], pos[1])
            for cur_row in new_grid:
                print(cur_row)
            print()
            new_word_list = word_list.copy()
            new_word_list.pop(0)
            final_grid = find_possible_grid(new_grid, new_word_list, grid_size)
            if final_grid != None:
                return final_grid
    return None


def write_grid_to_screen(grid, words_in_grid):
    # Print grid to the screen
    print("Final grid:")
    for line in grid:
        for element in line:
            print(" {}".format(element), end="")
        print()

    print("Words:")
    print(words_in_grid)
    # pprint.pprint(words_in_grid)

def get_crosswords():
    all_words = ['regular', 'violent', 'rebel', 'handy', 'noxious', 'bare', 'rightful', 'chance',
                 'agonizing', 'mean', 'report', 'harmony', 'barbarous', 'rapid', 'memory',
                 'vegetable', 'excite', 'illustrious', 'burly', 'fashion', 'field',
                 'seashore', 'wild', 'skate', 'temporary', 'debonair', 'forgetful', 'film',
                 'lavish', 'scary']
    max_word_amount = 10
    if len(all_words) > max_word_amount:
        words = rand_words(all_words, max_word_amount)
    else:
        words = all_words.copy()
    words.sort(key = len, reverse = True)
    grid_size = 15
    grid = []
    for i in range(grid_size):
        row = []
        for j in range(grid_size):
            row.append(0)
        grid.append(row)

    final_grid = make_crossword(grid, words, grid_size)
    write_grid_to_screen(final_grid, words)

    # placed_words = []
    # place_word_in_map(word, map, rand_x, rand_y, rand_direction, current_words)
    #
    # make_crossword(map, placed_words, words[1:])


    print(words)

    # make_crossword(all_words, grid_size)


if __name__ == "__main__":
    print("hello")
    get_crosswords()
