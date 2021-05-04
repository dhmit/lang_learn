"""
Custom command to populate text model with definition, examples, and images
"""
import re
import urllib
import urllib.request
import urllib.parse
import tqdm
from spellchecker import SpellChecker

# Ours
from app.analysis.parts_of_speech import (
    get_word_definitions,
    get_word_examples,
    get_valid_words,
)


# Modified Code from Bing library
def get_bing_image_url(query):
    """
    Given the word that we want to search for, returns a url of the image found from Bing image
    search
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0'
    }
    # Parse the page source and download pics
    request_url = 'https://www.bing.com/images/async?q=' + urllib.parse.quote_plus(query) \
                  + '&first=0&count=9&adlt=on'
    request = urllib.request.Request(request_url, None, headers=headers)
    with urllib.request.urlopen(request) as response:
        html = response.read().decode('utf8')
        links = re.findall('murl&quot;:&quot;(.*?)&quot;', html)
        return links


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
        image_urls = get_bing_image_url(word)
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
            image_url = get_bing_image_url(word)[0]
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
