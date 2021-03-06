"""
These view functions and classes implement API endpoints
"""
import json
import random

from django.http import Http404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .analysis.conversation_quiz import get_quiz_questions
from .models import (
    Text
)
from .serializers import (
    TextSerializer
)
from .analysis.parts_of_speech import (
    filter_pos,
    get_valid_words,
)
from .analysis.anagrams import (
    get_anagrams,
    get_letter_freq,
)
from .analysis.textdata import (
    get_text_data,
    get_story_data,
    get_misspelled_words,
)
from .analysis.crosswords import (
    get_crosswords,
)
from .quiz_creation.conjugation_quiz import get_quiz_sentences


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

    words = get_valid_words(text_obj.content, part_of_speech)

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
    words = get_valid_words(text_obj.content, part_of_speech)
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
                       'definition': definitions[word].get(part_of_speech, []),
                       'example': examples[word].get(part_of_speech, [])}
                      for word in words],
        'extra_words': extra_words
    }
    return Response(res)


@api_view(['GET'])
def get_picturebook_prompt(request, text_id, part_of_speech):
    """
    API endpoint for getting the necessary information for the picture book exercise
    given the id of the text and the part of speech. The words chosen will be random.
    """
    text_obj = Text.objects.get(id=text_id)
    image_urls = text_obj.images
    words = get_valid_words(text_obj.content, part_of_speech)
    random.shuffle(words)
    words = words[:4]

    res = [{'word': word,
            'url': image_urls.get(word, '')}
           for word in words]
    return Response(res)


@api_view(['GET'])
def get_picturebook_data(request):
    """
    API endpoint for getting the picture book images given the story the user wrote.
    """
    story_content = request.query_params.get('content')
    urls = get_story_data(story_content)
    misspelled = get_misspelled_words(story_content)
    res = [{'word': word,
            'url': urls[word]}
           for word in urls]
    res.append(misspelled)
    return Response(res)


@api_view(['POST'])
def add_text(request):
    """
    API endpoint for adding a piece of text
    """
    body = json.loads(request.body.decode('utf-8'))
    new_text_obj = Text(title=body['title'], content=body['content'])
    new_text_obj.save()
    get_text_data(new_text_obj)
    serializer = TextSerializer(new_text_obj)
    return Response(serializer.data)


@api_view(['POST'])
def update_text(request):
    """
    API endpoint for updating title, content, and modules for a given piece of text given
    the id of the text.
    """
    body = json.loads(request.body.decode('utf-8'))
    text_obj = Text.objects.get(id=body['id'])
    old_text = text_obj.content

    text_obj.title = body['title']
    text_obj.content = body['content']
    text_obj.modules = body['modules']
    text_obj.save()

    if old_text != text_obj.content:
        get_text_data(text_obj)

    return Response()


@api_view(['POST'])
def delete_text(request):
    """
    API endpoint for deleting a text.
    """
    body = json.loads(request.body.decode('utf-8'))
    text_obj = Text.objects.get(id=body)
    res = text_obj.delete()
    return Response(res)


@api_view(['GET'])
def get_crossword(request, text_id, part_of_speech):
    """
    API endpoint for getting the necessary information for the crossword given
    the id of the text and the part of speech.
    """
    text_obj = Text.objects.get(id=text_id)
    definitions = text_obj.definitions
    examples = text_obj.examples
    words = get_valid_words(text_obj.content, part_of_speech)

    # TODO: For Instructor view people, please make a function in the text model for getting
    #       definitions / examples given a word
    crossword_data = get_crosswords(words, (examples, definitions, part_of_speech))

    return Response(crossword_data)


@api_view(['GET'])
def get_quiz_data(request, text_id):
    """
    API endpoint for getting the necessary information for the verb conjugation quiz given
    the id of the text. The first verb in each sentence of the text will be fill-in. The options
    will be randomly selected and arranged.
    """
    try:
        text_obj = Text.objects.get(id=text_id)
    except Text.DoesNotExist as text_not_exist:
        raise Http404 from text_not_exist
    res = get_quiz_sentences(text_obj.content)
    return Response(res)


@api_view(['GET'])
def get_response_quiz_data(request, text_id):
    """
    API endpoint for getting the necessary information for the conversation quiz given
    the id of the text. [add more important info]
    """
    try:
        text_obj = Text.objects.get(id=text_id)
    except Text.DoesNotExist as text_not_exist:
        raise Http404 from text_not_exist
    res = get_quiz_questions(text_obj.content)
    return Response(res)
