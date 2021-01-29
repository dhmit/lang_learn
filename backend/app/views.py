"""
These view functions and classes implement API endpoints
"""
import random

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Text
)
from .serializers import (
    TextSerializer
)
from .analysis.parts_of_speech import (
    get_part_of_speech_words,
    get_word_examples,
    get_word_definition,
    filter_pos,
    get_valid_words,
)
from .analysis.anagrams import (
    get_anagrams,
    get_letter_freq,
)


@api_view(['GET'])
def all_text(request):
    """
    API endpoint to get all the pieces of text. This allows the user to choose which piece
    of text to generate exercises with.
    """
    text_obj = Text.objects.all()
    serializer = TextSerializer(text_obj, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def text(request, text_id):
    """
    API endpoint to get a single piece of text based on the ID (maybe we want to change this).
    """
    text_obj = Text.objects.get(id=text_id)
    serializer = TextSerializer(text_obj)
    return Response(serializer.data)


@api_view(['GET'])
def get_flashcards(request, text_id, part_of_speech):
    """
    API endpoint for getting the necessary information for the flashcards given
    the id of the text and the part of speech.
    """
    text_obj = Text.objects.get(id=text_id)
    image_urls = text_obj.images
    definitions = text_obj.definitions
    examples = text_obj.examples

    words = get_valid_words(text_obj.text, part_of_speech)

    res = [{'word': word,
            'definition': definitions[word].get(part_of_speech, []),
            'example': examples[word].get(part_of_speech, []),
            'url': image_urls.get(word, '')}
           for word in words]
    return Response(res)


@api_view(['GET'])
def get_anagram(request, text_id, part_of_speech):
    """
    API endpoint for getting the necessary information for the anagram exercise given
    the id of the text and the part of speech. The anagrams will be random.
    """
    text_obj = Text.objects.get(id=text_id)
    definitions = text_obj.definitions
    examples = text_obj.examples
    words = get_valid_words(text_obj.text, part_of_speech)
    random.shuffle(words)
    words = words[:5]

    # Gets the minimum possible numbers of each letter required to generate all the text
    anagram_freq = {}
    for word in words:
        cur_freq = get_letter_freq(word)
        for letter in cur_freq:
            if letter not in anagram_freq:
                anagram_freq[letter] = cur_freq[letter]
            elif anagram_freq[letter] < cur_freq[letter]:
                anagram_freq[letter] = cur_freq[letter]

    extra_words = get_anagrams(anagram_freq)
    extra_words -= set(words)  # Remove words from text from extra words
    extra_words = filter_pos(extra_words, part_of_speech)

    scrambled_letters = []
    for letter in anagram_freq:
        for i in range(anagram_freq[letter]):
            scrambled_letters.append(letter)

    res = {
        'letters': scrambled_letters,
        'word_data': [{'word': word,
                       'definition': definitions[word][part_of_speech],
                       'example': examples[word][part_of_speech]}
                      for word in words],
        'extra_words': extra_words
    }
    return Response(res)
