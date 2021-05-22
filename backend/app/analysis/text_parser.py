"""
Custom command to populate text model with definition, examples, and images
"""
import string
import nltk
import Levenshtein as Lev


# Modified Code from Bing library
def get_sentences(text):
    """
    Given a Text object, stores the definitions, examples, and image urls for all the words
    in this text.
    :param text: the Text object that we want to get sentences from
    """

    sentences = nltk.tokenize.sent_tokenize(text.replace("\n", " "))

    return sentences


def correct_sentence(given_sent, correct_sent):
    """
    Function takes the user's sentence and the correct sentence and compares them to find missing
    words, the incorrect words, and a grade

    :param given_sent: str, sentence the user types into the text box
    :param correct_sent: str, the correct sentence that the instructor inputs
    :return: dictionary with parameters holding the missing words, correct words, length of user
             input, word/correctness at each index
    """

    grade = {}

    # tokenize given_sent and correct_sent and turn them both into lists
    given_tok = nltk.tokenize.word_tokenize(given_sent.lower().translate(
        str.maketrans('', '', string.punctuation)))
    correct_tok = nltk.tokenize.word_tokenize(correct_sent.lower().translate(
        str.maketrans('', '', string.punctuation)))

    # hold all the correct words and removed every word that is found to hold only
    # the missing words
    grade["missing"] = correct_tok.copy()

    for word in given_tok:
        if grade["missing"].count(word) != 0:
            # remove the words that the user typed in to get the missing words
            grade["missing"].remove(word)


    grade["incorrect_word_index"] = []

    # hold the length of the users input
    grade["length"] = len(given_tok)

    # True if the user inputs the same sentence as the correct answer
    grade["isCorrect"] = given_tok == correct_tok

    index = 0
    for ind_1, word in enumerate(given_tok):

        match_found = False

        # loop until the match is found or all words are looked at and no match is found
        for ind_2, match in enumerate(correct_tok[index:]):

            if word == match:
                match_found = True
                match_index = ind_2 + index
                break

        # if the match is found then the grade is correct, incorrect otherwise
        # increase match_index by 1 if the match is found
        if match_found:
            grade[ind_1] = {"word": word,
                            "grade": "correct"}
            index = match_index + 1
        else:
            grade["incorrect_word_index"].append(ind_1)
            grade[ind_1] = {"word": word,
                            "grade": "incorrect"}

    # incorrect indices
    for word_index in grade["incorrect_word_index"]:

        # find the  most similar word
        sim_word = most_similar_word(given_tok[word_index], grade["missing"])

        if sim_word is not None:
            word_grade = correct_words(given_tok[word_index], sim_word)
            grade[word_index]["word_grade"] = word_grade

    return grade


def most_similar_word(word, comparisons):
    """
    Take a word and find the most similar word in a given list

    :param word: string with one word
    :param comparisons: list of words
    :return: string, most similar word in comparisons to word
    """
    min_lev_val = None
    min_lev_word = None

    # check the missing words and see how similar they are
    for current_word in comparisons:
        current_val = Lev.distance(word, current_word)

        # see if the word is less or more similar
        if min_lev_val is None or min_lev_val > current_val:
            min_lev_val = current_val
            min_lev_word = current_word

    # return the most similar word
    return min_lev_word


def correct_words(given_word, correct_word):
    """
    Determine which letters in a input word are correct and incorrect

    :param given_word: string with one word, the incorrect word from the user's input
    :param correct_word: string with one word, the similar word that is correct
    :return:
    """
    grade = {}

    char_missing = []

    char_missing[:0] = correct_word

    # remove the character if the character is there, find out how many are missing
    for char in given_word:
        if char_missing.count(char) != 0:
            char_missing.remove(char)

    grade["missing"] = list(char_missing)

    # for each character, hold whether it is correct or incorrect
    index = 0
    for ind_1, char in enumerate(given_word):
        match_found = False
        for ind_2, match in enumerate(correct_word[index:]):

            if char == match:
                match_found = True
                match_index = ind_2 + index
                break
        if match_found:
            grade[ind_1] = {"char": char,
                            "grade": "correct"}
            index = match_index + 1
        else:
            grade[ind_1] = {"char": char,
                            "grade": "incorrect"}

    return grade
