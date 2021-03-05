"""
Custom command to populate text model with definition, examples, and images
"""
import re
import urllib
import urllib.request
import urllib.parse
import tqdm

# Django
from django.core.management.base import BaseCommand

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


class Command(BaseCommand):
    """
    Custom django-admin command used to get all image urls for every part of speech from a text
    """
    help = '''Fetches image urls from https://freesvgclipart.com/ and stores them in the database.\n
    Use --all if you want to update the urls of all the text, regardless of whether it was
    already found.\n
    If there are no arguments, then it will only fetch the url for words that do not already have
    image urls.'''

    def add_arguments(self, parser):
        parser.add_argument('--all', action='store_true')

    def handle(self, *args, **options):
        part_of_speech = ['noun', 'verb', 'adjective', 'adverb']
        get_all = options.get('all')

        for text_obj in Text.objects.all():
            # Reused the old image url dictionary if we are not getting all of the urls
            word_urls = {} if get_all else text_obj.images
            word_definitions = {} if get_all else text_obj.definitions
            word_examples = {} if get_all else text_obj.examples

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
