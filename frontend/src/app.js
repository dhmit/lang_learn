/*
 * The entrypoint for our application:
 * This module gets loaded into the DOM, and then it loads everything else.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { IndexView } from './index/index';
import { QuizView } from './quizView/quizView';
import { AnagramView } from './anagramView/anagramView';
import { InstructorView } from './instructorView/instructorView';
import { AllQuizView } from './quizView/allQuizView';
import { FlashcardView } from './flashcard/flashcardView';
import { CrosswordView } from './crosswordView/crosswordView';
import { ResponseAllQuizView } from './responseQuizView/responseAllQuizView';
import { ResponseQuizView } from './responseQuizView/responseQuizView';

// Import all styles
import './UILibrary/styles.scss';

window.app_modules = {
    React,  // Make React accessible from the base template
    ReactDOM,  // Make ReactDOM accessible from the base template

    // Add all frontend views here
    AllQuizView,
    AnagramView,
    InstructorView,
    FlashcardView,
    CrosswordView,
    IndexView,
    QuizView,
    ResponseAllQuizView,
    ResponseQuizView,
};
