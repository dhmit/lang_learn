"""
Custom command to populate text model with definition, examples, and images
"""
import nltk

# Ours


# Modified Code from Bing library
def get_sentences(text):
    """
    Given a Text object, stores the definitions, examples, and image urls for all the words
    in this text.
    :param text_obj: the Text object that we want to get sentences from
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
