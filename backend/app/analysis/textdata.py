"""
Custom command to populate text model with definition, examples, and images
"""
import re
import tqdm
from django.conf import settings
from spellchecker import SpellChecker
from google_images_search import GoogleImagesSearch

# Ours
from app.analysis.parts_of_speech import (
    get_word_definitions,
    get_word_examples,
    get_valid_words,
)


def get_image_urls(query):
    """
    Given the word that we want to search for, returns urls for images found using Google Images
    """
    gis = GoogleImagesSearch(settings.GOOGLE_API_KEY, settings.SEARCH_CX)
    _search_params = {
        'q': query,
        'num': 9,
        'safe': 'high',
        'rights': 'CC_PUBLICDOMAIN',
        'imgSize': 'LARGE'
    }
    gis.search(search_params=_search_params)
    return [image._url for image in gis.results()]


def get_text_data(text_obj):
    """
    Given a Text object, stores the definitions, examples, and image urls for all the words
    in this text.
    :param text_obj: the Text object that we want to get data for
    """
    word_data = text_obj.word_data
    words = get_valid_words(text_obj.content.lower())

    # Only find the data for words that are new
    old_words_set = set(word_data.keys())
    new_words_set = set(words)
    diff_words = new_words_set - old_words_set
    delete_words = old_words_set - new_words_set

    # Remove word data for old words
    for word in delete_words:
        word_data.pop(word)

    print(f"Getting definitions for \"{text_obj.title}\"...")
    definitions = get_word_definitions(diff_words)
    print(f"Getting examples for \"{text_obj.title}\"...")
    examples = get_word_examples(diff_words, text_obj.content.lower())

    # Add examples and definitions to word_data
    for word in diff_words:
        chosen_definition = ""
        if len(definitions[word].keys()) > 0:
            # Pick some part of speech and use the first definition
            pos = list(definitions[word].keys())[0]
            chosen_definition = definitions[word][pos][0]

        word_data[word] = {
            "definitions": definitions[word],
            "examples": examples[word],
            "chosen_definition": chosen_definition,
            "chosen_example": examples[word][0] if len(examples[word]) > 0 else "",
        }

    print(f"Getting images for \"{text_obj.title}\"...")
    for word in tqdm.tqdm(diff_words):
        image_urls = get_image_urls(word)
        word_data[word]["images"] = image_urls
        word_data[word]["chosen_image"] = image_urls[0] if len(image_urls) > 0 else ""

    text_obj.word_data = word_data
    text_obj.save()


def get_story_data(content):
    """
    Given the body of a story, return the image urls for all the nouns in the text.
    """
    word_urls = {}
    words = get_valid_words(content.lower(), 'noun')
    for word in words:
        word = word.lower()
        if word not in word_urls:
            image_url = get_image_urls(word)[0]
            if image_url is not None:
                word_urls[word.lower()] = image_url
    return word_urls


def get_misspelled_words(content):
    """
    Given the body of a story, return a dictionary with the keys being the
    misspelled word and the values the correct word.
    """
    correct_spelling = {}
    spell = SpellChecker()
    words_list = re.compile("([\\w][\\w]*'?\\w?)").findall(content)
    misspelled = spell.unknown(words_list)
    for word in misspelled:
        correct_spelling[word] = spell.correction(word)
    return correct_spelling
