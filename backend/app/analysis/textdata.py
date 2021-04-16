"""
Custom command to populate text model with definition, examples, and images
"""
import re
import urllib
import urllib.request
import urllib.parse
import tqdm

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
                  + '&first=0&count=10&adlt=off'
    request = urllib.request.Request(request_url, None, headers=headers)
    response = urllib.request.urlopen(request)
    html = response.read().decode('utf8')
    links = re.findall('murl&quot;:&quot;(.*?)&quot;', html)
    return links


def get_text_data(text_obj):
    """
    Given a Text object, stores the definitions, examples, and image urls for all the words
    in this text.
    :param text_obj: the Text object that we want to get data for
    """
    # part_of_speech = ['noun', 'verb', 'adjective', 'adverb']

    word_data = dict()

    # TODO: optimizations for update to not refetch data for words that already exist
    words = get_valid_words(text_obj.content.lower())
    print(f"Getting definitions for \"{text_obj.title}\"...")
    definitions = get_word_definitions(words)
    print(f"Getting examples for \"{text_obj.title}\"...")
    examples = get_word_examples(words, text_obj.content.lower())

    for word in words:
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
    for word in tqdm.tqdm(words):
        image_urls = get_bing_image_url(word)
        print(image_urls)
        word_data[word]["images"] = image_urls
        word_data[word]["chosen_image"] = image_urls[0] if len(image_urls) > 0 else ""

    print(word_data)

    text_obj.word_data = word_data
    text_obj.save()
