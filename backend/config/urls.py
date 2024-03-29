"""
URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URL configuration
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from app.common import render_react_view
from app.views import (
    all_text,
    get_anagram,
    update_text,
    delete_text,
    add_text,
    get_flashcards,
    get_picturebook_prompt,
    get_picturebook_data,
    get_crossword,
    get_quiz_data,
    text, get_response_quiz_data,
)


def react_view_path(route, component_name):
    """ Convenience function for React views """
    return path(
        route,
        render_react_view,
        {
            'component_name': component_name,
        },
    )


urlpatterns = [
    # Django admin page
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/all_text', all_text),
    path('api/all_text/', all_text),
    path('api/get_anagram/<int:text_id>/<str:part_of_speech>', get_anagram),
    path('api/update_text', update_text),
    path('api/delete_text', delete_text),
    path('api/add_text', add_text),
    path('api/get_flashcards/<int:text_id>/<str:part_of_speech>', get_flashcards),
    path('api/get_crossword/<int:text_id>/<str:part_of_speech>', get_crossword),
    path('api/get_quiz_data/<int:text_id>/', get_quiz_data),
    path('api/get_response_quiz_data/<int:text_id>/', get_response_quiz_data),
    path('api/text/<int:text_id>', text),
    path('api/get_picturebook_prompt/<int:text_id>/<str:part_of_speech>', get_picturebook_prompt),
    path('api/get_picturebook_data', get_picturebook_data),

    # View paths
    react_view_path('', 'IndexView'),
    react_view_path('anagrams/<int:textID>/<str:partOfSpeech>', 'AnagramView'),
    # react_view_path('instructor', 'InstructorView'),
    react_view_path('about/', 'AboutView'),
    react_view_path('flashcards/<int:textID>/<str:partOfSpeech>', 'FlashcardView'),
    react_view_path('crossword/<int:textID>/<str:partOfSpeech>', 'CrosswordView'),
    react_view_path('anagram/<int:textID>/<str:partOfSpeech>', 'AnagramView'),
    react_view_path('quiz/', 'AllQuizView'),
    react_view_path('quiz/<int:textID>/', 'QuizView'),
    react_view_path('picturebook/<int:textID>/<str:partOfSpeech>', 'PictureBookView'),
    react_view_path('response_quiz/', 'ResponseAllQuizView'),
    react_view_path('response_quiz/<int:textID>/', 'ResponseQuizView'),
]
