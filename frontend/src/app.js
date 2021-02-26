/*
 * The entrypoint for our application:
 * This module gets loaded into the DOM, and then it loads everything else.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { IndexView } from './index/index';
import { AnagramView } from './anagramView/anagramView';
import { ResponseAllQuizView } from './responseQuizView/responseAllQuizView';
import { ResponseQuizView } from './responseQuizView/responseQuizView';

// Import all styles
import './UILibrary/styles.scss';

window.app_modules = {
    React,  // Make React accessible from the base template
    ReactDOM,  // Make ReactDOM accessible from the base template

    // Add all frontend views here
    IndexView,
    AnagramView,
    ResponseAllQuizView,
    ResponseQuizView,
};
