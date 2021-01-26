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
    filter_pos
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


def quote_in_word(word):
    quotes = ["“", '"', "'", "’"]
    for quote in quotes:
        if quote in word:
            return True
    return False


@api_view(['GET'])
def get_anagram(request, text_id, part_of_speech):
    """
    API endpoint for getting the necessary information for the anagram exercise given
    the id of the text and the part of speech. The anagrams will be random.
    """
    text_obj = Text.objects.get(id=text_id)
    words = list(set(word for word in get_part_of_speech_words(text_obj.text.lower(),
                                                               part_of_speech)
                     if (not quote_in_word(word) and len(word) > 2)))
    random.shuffle(words)
    # TODO: Determine how many words from text we should use and which to use
    words = words[:5]

    definitions = get_word_definition(words, part_of_speech)
    examples = get_word_examples(words)

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

    word_data = [[word, {'definition': definitions[word], 'example': examples[word]}]
                 for word in words]

    scrambled_letters = []
    for letter in anagram_freq:
        for i in range(anagram_freq[letter]):
            scrambled_letters.append(letter)

    res = {'letters': scrambled_letters, 'word_data': word_data, 'extra_words': extra_words}
    return Response(res)
