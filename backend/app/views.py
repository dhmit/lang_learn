"""
These view functions and classes implement API endpoints
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Text
)
from .serializers import (
    TextSerializer
)
from .quiz_creation.conjugation_quiz import get_quiz_sentences


@api_view(['GET'])
def get_quiz_data(request, text_id):
    """
    API endpoint for getting the necessary information for the verb conjugation quiz given
    the id of the text. The first verb in each sentence of the text will be fill-in. The options
    will be randomly selected and arranged.
    """
    text_obj = Text.objects.get(id=text_id)
    res = get_quiz_sentences(text_obj.text)
    return Response(res)


@api_view(['GET'])
def get_all_texts(request):
    """
    API endpoint to get all texts in the database
    """
    text_obj = Text.objects.all()
    serializer = TextSerializer(text_obj, many=True)
    return Response(serializer.data)
