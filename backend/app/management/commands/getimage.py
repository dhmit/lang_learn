import requests
import tqdm

# Django
from django.core.management.base import BaseCommand

# Ours
from app.models import Text
from app.analysis.parts_of_speech import get_part_of_speech_words


class Command(BaseCommand):
    """
    Custom django-admin command used to get all image urls for every part of speech from a text
    """
    help = 'Fetches image urls from https://freesvgclipart.com/ and stores them in the database'

    def handle(self, *args, **options):
        part_of_speech = ['noun', 'verb', 'adjective', 'adverb']
        url_base = "https://freesvgclipart.com/wp-json/clipart/api?num=1&query="

        for text_obj in Text.objects.all():
            word_urls = {}
            for pos in part_of_speech:
                words = get_part_of_speech_words(text_obj.text, pos)
                print("Getting image urls for " + pos + " in the text " + text_obj.title)
                for word in tqdm.tqdm(words):
                    if word not in word_urls:
                        res = requests.get(url_base + word + "&tags=" + word)
                        items = res.json().get("items")
                        if items is not None and len(items) > 0:
                            svg_url = items[0].get("svgurl")
                            word_urls[word.lower()] = svg_url
            text_obj.images = word_urls
            text_obj.save()
