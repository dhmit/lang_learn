import requests
import tqdm

# Django
from django.core.management.base import BaseCommand

# Ours
from app.models import Text
from app.analysis.parts_of_speech import get_part_of_speech_words


def get_svg_url(word):
    url_base = "https://freesvgclipart.com/wp-json/clipart/api?num=1&query="
    res = requests.get(url_base + word + "&tags=" + word)
    items = res.json().get("items")
    if items is not None and len(items) > 0:
        return items[0].get("svgurl")
    else:
        return None


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

            for pos in part_of_speech:
                words = get_part_of_speech_words(text_obj.text, pos)
                print("Getting image urls for " + pos + " in the text " + text_obj.title)
                for word in tqdm.tqdm(words):
                    if word not in word_urls:
                        svg_url = get_svg_url(word)
                        if svg_url is not None:
                            word_urls[word.lower()] = svg_url
            text_obj.images = word_urls
            text_obj.save()
