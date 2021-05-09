"""
Custom command to populate text model with definition, examples, and images
"""
import nltk
import string

# Ours


# Modified Code from Bing library
def get_sentences(text):
    """
    Given a Text object, stores the definitions, examples, and image urls for all the words
    in this text.
    :param text: the Text object that we want to get sentences from
    """

    sentences = nltk.tokenize.sent_tokenize(text)
    # text_paragraph = text_obj.content
    # temp_sentences = text_paragraph.split(".")
    #
    # sentences = []
    # for sent in temp_sentences:
    #     sentences.extend(sent.split("!"))

    print(sentences)
    return sentences


def correct_sentence(given_sent, correct_sent):
    grade = {}
    print(given_sent.translate(str.maketrans('', '', string.punctuation)))
    given_tok = nltk.tokenize.word_tokenize(given_sent.translate(
        str.maketrans('', '', string.punctuation)))
    correct_tok = nltk.tokenize.word_tokenize(correct_sent.translate(
        str.maketrans('', '', string.punctuation)))

    words_missing = correct_tok.copy()
    for word in given_tok:
        if words_missing.count(word) != 0:
            words_missing.remove(word)

    grade["missing"] = words_missing

    index = 0
    for ind_1, word in enumerate(given_tok):
        match_found = False
        for ind_2, match in enumerate(correct_tok[index:]):
            # print(word, match)
            if word == match:
                match_found = True
                match_index = ind_2 + index
                break
        if match_found:
            grade[ind_1] = {"word": word,
                            "grade": "correct"}
            index = match_index + 1
        else:
            grade[ind_1] = {"word": word,
                            "grade": "incorrect"}
    return grade


if __name__ == '__main__':
    actual = "i like soup"
    given = "i like, soop"
    print(actual, given)
    print(correct_sentence(given, actual))

    # actual = ["i like soup", "soup likes me", "EOM"]
    #
    # res = [{'sentence': sentence} for sentence in actual]
    # print(res)

    # part_of_speech = ['noun', 'verb', 'adjective', 'adverb']
    #
    # # Reused the old image url dictionary if we are not getting all of the urls
    # word_urls = {}
    # word_definitions = {}
    # word_examples = {}

    # for pos in part_of_speech:
    #     print("Getting definitions and examples for " + pos + " in the text " +
    #           text_obj.title + "... (This might take a while)")
    #     words = get_valid_words(text_obj.content.lower(), pos)
    #     definitions = get_word_definition(words, pos)
    #     examples = get_word_examples(words, pos, text_obj.content.lower())
    #
    #     print("Updating database for " + pos + " in the text " + text_obj.title)
    #     for word in tqdm.tqdm(words):
    #         word = word.lower()
    #         if word not in word_urls:
    #             image_url = get_bing_image_url(word)
    #             if image_url is not None:
    #                 word_urls[word.lower()] = image_url
    #
    #         if word not in word_definitions:
    #             word_definitions[word] = {pos: definitions[word]}
    #         else:
    #             word_definitions[word][pos] = definitions[word]
    #
    #         if word not in word_examples:
    #             word_examples[word] = {pos: examples[word]}
    #         else:
    #             word_examples[word][pos] = examples[word]
    #
    # text_obj.images = word_urls
    # text_obj.definitions = word_definitions
    # text_obj.examples = word_examples
    # text_obj.save()
