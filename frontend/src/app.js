/*
 * The entrypoint for our application:
 * This module gets loaded into the DOM, and then it loads everything else.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { IndexView } from './index/index';
import { QuizView } from './views/quiz/quizView';
import { AnagramView } from './views/anagram/anagramView';
import { InstructorView } from './views/instructor/instructorView';
import { FlashcardView } from './views/flashcard/flashcardView';
import { AllQuizView } from './views/quiz/allQuizView';
import { PictureBookView } from './views/pictureBook/pictureBookView';
import { CrosswordView } from './views/crossword/crosswordView';
import { ResponseAllQuizView } from './views/responseQuiz/responseAllQuizView';
import { ResponseQuizView } from './views/responseQuiz/responseQuizView';

// Import all styles
import './components/styles.scss';

window.app_modules = {
    React,  // Make React accessible from the base template
    ReactDOM,  // Make ReactDOM accessible from the base template

    // Add all frontend views here
    AllQuizView,
    AnagramView,
    InstructorView,
    FlashcardView,
    PictureBookView,
    CrosswordView,
    IndexView,
    QuizView,
    ResponseAllQuizView,
    ResponseQuizView,
};
