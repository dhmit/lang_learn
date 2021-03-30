"""
Helper functions for generating crossword from a list of words
"""
import random
import copy


def rand_words(all_words, max_num_words):
    """
    generates a random sequence of words given a list of words and max entries
    :param all_words: datd structure containing all words to put into crossword
    :param max_num_words: number of words that can be made into crossword
    :return: list of words to be used (in order of how they will be placed in the grid)
    """
    words_list = all_words.copy()
    random.shuffle(words_list)
    return words_list[:max_num_words]


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

    # checks if word is within boundaries of grid
    if not is_within_bounds(len(word), row, col, direction, (len(grid[0]), len(grid))):
        return False

    # checks for collisions between words
    if collides_with_existing_words(word, row, col, direction, grid):
        return False

    # makes sure word is not directly after/before another word
    if not ends_are_isolated(word, row, col, direction, grid):
        return False

    # If we can't find any issues, it must be okay!
    return True


def is_within_bounds(word_len, row, column, direction, grid_size):
    """ Returns whether the given word is withing the bounds of the grid.
    """
    # checks if word is in within grid boundaries
    return ((direction == "across" and column + word_len <= grid_size[0] - 1)
            or (direction == "down" and row + word_len <= grid_size[1] - 1)) and (
               row >= 0 and column >= 0)


def is_cell_free(row, col, grid):
    """ Checks whether a cell is free.
    Does not throw if the indices are out of bounds. These cases return as free.
    """
    # Negative indices are "legal", but we treat them as out of bounds.
    if row < 0 or col < 0:
        return True
    # marks cell as free
    try:
        return grid[row][col] == 0
    except IndexError:
        return True


def ends_are_isolated(word, row, column, direction, grid):
    """ Returns whether the given word is isolated (blank before start and after end).
    """
    if direction == "across":
        # If the preceding space isn't empty
        if not is_cell_free(row, column - 1, grid):
            return False
        # If the succeeding space isn't empty
        if not is_cell_free(row, column + len(word), grid):
            return False
    if direction == "down":
        # If the preceding space isn't empty
        if not is_cell_free(row - 1, column, grid):
            return False
        # If the succeeding space isn't empty
        if not is_cell_free(row + len(word), column, grid):
            return False

    return True


def collides_with_existing_words(word, row, column, direction, grid):
    """ Returns whether the given word collides with an existing one.
    """
    # iterate over letters and their indices
    for k, letter in enumerate(list(word)):
        if direction == "across":
            # checks for collisions between words
            if grid[row][column + k] != 0 and grid[row][column + k] != letter:
                return True
        if direction == "down":
            # checks for collisions between words
            if grid[row + k][column] != 0 and grid[row + k][column] != letter:
                return True

    return False

    # code to-be tested to deal with other types of word collisions (avoiding clues lining up)

    # for k, letter in enumerate(list(word)):
        # for i in (-1, 0, 1):
        #     if direction == "across":
        #         # checks for collisions between words
        #         if grid[row + i][column + k] != 0:
        #             if i == 0 and grid[row][column + k] != letter:
        #                 return True
        #             else:
        #                 for clue in clues:
        #                     if clue["row"] == row + 1 and clue["col"] == column + k and clue["across"] != None:
        #                         return True
        #     if direction == "down":
        #         # checks for collisions between words
        #         if grid[row + k][column + i] != 0:
        #             if i == 0 and grid[row + k][column] != letter:
        #                 return True
        #             else:
        #                 for clue in clues:
        #                     if clue["row"] == row + 1 and clue["col"] == column + k and clue["down"] != None:
        #                         return True





def add_word_to_grid(grid, word, row, col, direction):
    """ Adds a possibility to the given grid, which is modified in-place.
    (see generate_grid)
    """
    # Word is left-to-right
    if direction == "across":
        grid[row][col:len(list(word)) + col] = list(word)

    # Word is top-to-bottom
    if direction == "down":
        # iterates over letters to place letters in correct rows
        for index, letter in enumerate(list(word)):
            grid[row + index][col] = letter


def make_crossword(word_list):
    """
    Returns a grid with all the words in a crossword format and their corresponding
    clues.
    :param: grid (list): 2D list representing the format of the crossword
            word_list (list): contains words to be placed into crossword
            grid_size (int): represents dimension of grid (grid is a square)
    """
    # sorts words in order of decreasing length
    word_list.sort(key=len, reverse=True)
    first_word = word_list[0]
    grid_size = 15
    grid = [[0 for _ in range(grid_size)] for _ in range(grid_size)]
    # determines the amount of iterations needed to place word into grid
    # makes sure first word is properly placed on grid
    first_range = grid_size - len(first_word) - 1
    for start_row in range(first_range):
        for start_col in range(first_range):
            for start_direction in ["across", "down"]:
                # creates copy of grid and adds word/clue in if word can be placed
                if is_valid(grid, first_word, start_row, start_col, start_direction):
                    new_grid = copy.deepcopy(grid)
                    add_word_to_grid(new_grid, first_word, start_row, start_col, start_direction)

                    clues = []
                    add_clue(clues, first_word, start_col, start_row, start_direction)
                    # might have bug of only having one item in list
                    (final_grid, final_clues) = find_possible_grid(new_grid,
                                                                   word_list[1:],
                                                                   grid_size,
                                                                   clues)
                    # returns grid and clues if grid can be made
                    if final_grid is not None:
                        return final_grid, final_clues
    return None, None


def find_possible_grid(grid, word_list, grid_size, clues):
    """
    :param: grid (list): 2D list representing the format of the crossword
            word_list (list): contains words to be placed into crossword
            grid_size (int): represents dimension of grid (grid is a square)
            clues (list): list of clues associated with the words in word_list
    :returns: grid (list): 2D list representing the final crossword grid
              clues (list): contains clues associated with the words in grid

    """
    # word_list has no words left
    if len(word_list) == 0:
        return grid, clues

    current_word = word_list[0]
    # list containing potential start coordinate and direction of current_word
    possible = []  # ((i,j), direction)
    for let_indx, let in enumerate(current_word):
        for i in range(grid_size):
            for j in range(grid_size):
                if grid[i][j] == let:
                    possible.append(((i, j - let_indx), "across"))
                    possible.append(((i - let_indx, j), "down"))
    # randomizes potential placement of the word
    random.shuffle(possible)
    for pos in possible:
        new_grid = copy.deepcopy(grid)
        # checks if word can be added at this location and appends
        if is_valid(grid, current_word, pos[0][0], pos[0][1], pos[1]):
            add_word_to_grid(new_grid, current_word, pos[0][0], pos[0][1], pos[1])
            add_clue(clues, current_word, pos[0][1], pos[0][0], pos[1])
            new_word_list = word_list.copy()
            new_word_list.pop(0)
            final = find_possible_grid(new_grid, new_word_list, grid_size, copy.deepcopy(clues))
            if final is not None:
                return final[0], final[1]
    return None, None


def add_clue(clues, word, col, row, direction):
    """
    modifies clues by creating a dictionary that contains information about a word
    :param  clues (list): contains clues associated with the words in grid
            word (string): word in the grid
            col (int): starting column of word
            row (int) : starting row of word
            direction (string): denotes direction word is placed in (across or down)
    """
    word_found = False
    for clue in clues:
        # creates dictionary containing word and location
        if clue["row"] == row and clue["col"] == col:
            clue[direction] = {
                "word": word,
                "clue": None
            }
            word_found = True
            break
    # word is not found in grid
    if not word_found:
        clue = {"row": row,
                "col": col,
                "across": None,
                "down": None,
                direction: {
                    "word": word,
                    "clue": None
                }
                }
        # adds word's clue to clues
        clues.append(clue)


def write_grid_to_screen(grid, words_in_grid):
    """
    helper function that allows us to print grid out in a readable format
    :param: grid (list): 2D list representing the format of the crossword
            words_in_grid (list): containing all the words in the grid
    """
    # Print grid to the screen
    print("Final grid:")
    for line in grid:
        for element in line:
            print(" {}".format(element), end="")
        print()

    print("Words:")
    print(words_in_grid)


def get_crosswords(all_words):
    """
    produces a dictionary containing the clues associated with the words put into the crossword
    and a solution grid to the crossword
    :param: all_words (list): list of all words that can be put into a crossword
    """
    # initializes max number of words that can be made into crossword
    max_word_amount = 15
    # initializes values to be placed in cross_dict
    solution = None
    clues = None
    iterations = 5

    for _ in range(iterations):
        # creates a random list of words to be used in crossword
        if len(all_words) > max_word_amount:
            words = rand_words(all_words, max_word_amount)
        else:
            words = all_words.copy()
        solution, clues = make_crossword(words)
        if solution is not None:
            break

    if solution is None:
        return {
            "clues": [],
            "solution": [],
        }

    for i, row in enumerate(solution):
        for j, col in enumerate(row):
            # converts letters in the word to uppercase
            if col != 0:
                row[j] = col.upper()
            # fills cells that need to be empty with a #
            else:
                row[j] = '#'

    cross_dict = {
        "clues": clues,
        'solution': solution,
    }

    return cross_dict
