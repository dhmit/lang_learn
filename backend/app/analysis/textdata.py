"""
Custom command to populate text model with definition, examples, and images
"""
import re
import urllib
import urllib.request
import urllib.parse
import tqdm

# Ours
from app.models import Text
from app.analysis.parts_of_speech import (
    get_word_definition,
    get_word_examples,
    get_valid_words,
)


# Modified Code from Bing library
def get_bing_image_url(query):
    """
    Custom command to get image url from Bing
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0'
    }
    # Parse the page source and download pics
    request_url = 'https://www.bing.com/images/async?q=' + urllib.parse.quote_plus(query) \
                  + '&first=0&count=1&adlt=off'
    request = urllib.request.Request(request_url, None, headers=headers)
    response = urllib.request.urlopen(request)
    html = response.read().decode('utf8')
    links = re.findall('murl&quot;:&quot;(.*?)&quot;', html)
    return links[0]


def get_text_data(text_obj):
    part_of_speech = ['noun', 'verb', 'adjective', 'adverb']

    # Reused the old image url dictionary if we are not getting all of the urls
    word_urls = {}
    word_definitions = {}
    word_examples = {}

    for pos in part_of_speech:
        print("Getting definitions and examples for " + pos + " in the text " +
              text_obj.title + "... (This might take a while)")
        words = get_valid_words(text_obj.content.lower(), pos)
        definitions = get_word_definition(words, pos)
        examples = get_word_examples(words, pos, text_obj.content.lower())

        print("Updating database for " + pos + " in the text " + text_obj.title)
        for word in tqdm.tqdm(words):
            word = word.lower()
            if word not in word_urls:
                image_url = get_bing_image_url(word)
                if image_url is not None:
                    word_urls[word.lower()] = image_url

            if word not in word_definitions:
                word_definitions[word] = {pos: definitions[word]}
            else:
                word_definitions[word][pos] = definitions[word]

            if word not in word_examples:
                word_examples[word] = {pos: examples[word]}
            else:
                word_examples[word][pos] = examples[word]

    text_obj.images = word_urls
    text_obj.definitions = word_definitions
    text_obj.examples = word_examples
    text_obj.save()
