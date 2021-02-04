import random
from app.analysis.parts_of_speech import get_parts_of_speech_tags, CONTRACTIONS
from app.quiz_creation.verb_conjugation import (
    verb_tenses,
    verb_tense,
    verb_tenses_keys,
    verb_infinitive,
)


def get_sentence_options(word):
    """
    Creates the answer choices for a sentence in the quiz game
    :param word: A verb (string) that is the answer to the question
    :return: A list of 4 words to serve as the answer choices
    """
    options = [word]
    word_is_capitalized = word[0].isupper()
    # Check if tense is found in the tenses dictionary
    tenses = verb_tenses.get(verb_infinitive(word), '')
    if tenses:
        # Determine the number of discrete tenses of the verb
        discrete_tenses = []
        for tense in tenses:
            if tense != '' and tense != word and tense not in discrete_tenses:
                discrete_tenses.append(tense)

        if len(discrete_tenses) >= 3:
            options += random.sample(discrete_tenses, 3)
        else:
            # If the verb does not have at least 3 discrete verb tenses, add the same tense of
            # another verb. ex: word = walked, other_options = baked, raked, etc.
            verb_form = verb_tense(word)
            key = verb_tenses_keys[verb_form]
            verbs_of_same_tense = [
                verb_tenses[verb][key] for verb in verb_tenses if verb_tenses[verb][key] != ''
            ]
            options += discrete_tenses
            options += random.sample(verbs_of_same_tense, 3 - len(discrete_tenses))
    else:
        # If the verb is not in the verb_tenses dictionary, get three random verb infinitives
        # (keys) from the dictionary
        options += random.sample(list(verb_tenses), 3)

    # Capitalize other options if the original word was capitalized
    if word_is_capitalized:
        for i in range(4):
            options[i] = options[i].capitalize()

    random.shuffle(options)

    # Capitalize the options if verb is at the beginning of the sentence
    if word[0].isupper():
        return [w.capitalize() for w in options]

    return options


def process_text(text):
    """
    Removes contractions and replaces direct quotation marks with their python escape sequence
    equivalents
    :param text: A body of text as a string
    :return: text: A body of text as a string with no contractions
    """

    # remove_contractions is buggy
    # processed = remove_contractions(text)
    # need to test on input text from frontend
    processed = text.replace('"', '\"')
    processed = processed.replace('’', "\'")

    return processed



def get_quiz_sentences(text):
    """
    Given a piece of text, create a dictionary of lists. The lists contain a single sentence
    missing a verb, 4 options for the quiz (including the missing verb), and the missing verb.
    :param text: A body of text as a string
    :return: List of sentences (Sentences are formatted as dictionaries with a sentence string,
    list of options, and an answer string).
    """
    text = process_text(text)
    pos_tags = get_parts_of_speech_tags(text)
    quiz_sentences = []
    current_sentence = {
        'sentence': [],
        'options': [],
        'answer': None
    }

    # Keep track of the absolute and relative indexes of each word
    verb_index_data = [0, []]
    is_contraction = False
    for i, [word, pos] in enumerate(pos_tags):

        # Removes spaces with words, commas, and quotations
        # "~~" is a filler to preserve length of list when indexing for the verb
        if pos == ',' or pos == "POS" or word == "'" or word == "''":
            current_sentence['sentence'][-1] += word
            current_sentence['sentence'].append("~~")
            continue

        # If the current word is a type of verb, record its index.
        if pos in ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']:
            verb_index_data[1].append(i)

        # remove space between beginning double quotes and word
        if pos_tags[i - 1][1] == '``':
            current_sentence['sentence'][-1] = "~~"
            current_sentence['sentence'].append("''" + word)
            continue

        # prevent contractions from splitting
        if i != len(pos_tags)-1 and word + pos_tags[i+1][0] in CONTRACTIONS:
            current_sentence['sentence'].append(word + pos_tags[i+1][0])
            is_contraction = True
            continue

        # adds filler when adjusting contractions
        if is_contraction:
            current_sentence['sentence'].append("~~")
            is_contraction = False
            continue


        # Add a new word to the current sentence.
        current_sentence['sentence'].append(word)

        # If a punctuation is found or there are no more words left, start a new sentence/end
        # formatting.
        if pos == '.' or i == len(pos_tags) - 1:

            # If there are verbs in the sentence, randomly select one of any type and make it a
            # fill-in.
            if len(verb_index_data[1]) > 0:
                verb_index = random.choice(verb_index_data[1]) - verb_index_data[0]
                sentence = current_sentence['sentence']
                word = sentence[verb_index]

                # make sure answer choices don't include quotations
                # fixes question to include quotation marks
                if word[0] == "'" or word[0] == '"':
                    current_sentence['options'] = get_sentence_options(word[1:])
                    current_sentence['answer'] = word[1:]
                    quote_type = word[0]
                    current_sentence['sentence'][verb_index] = quote_type + "___"
                elif word[-1] == "'" or word[-1] == '"':
                    current_sentence['options'] = get_sentence_options(word[:-1])
                    current_sentence['answer'] = word[:-1]
                    quote_type = word[-1]
                    current_sentence['sentence'][verb_index] = "___" + quote_type
                else:
                    current_sentence['sentence'] = (
                        sentence[:verb_index] + ['___'] + sentence[verb_index + 1:]
                    )
                    current_sentence['options'] = get_sentence_options(word)
                    current_sentence['answer'] = word

            # Add the sentence if it has an answer.
            if current_sentence['answer']:

                # If the final 'word' in a sentence is a punctuation, connect the punctuation and
                # the last normal word.
                # remove fillers
                while "~~" in current_sentence['sentence']:
                    current_sentence['sentence'].remove("~~")

                if pos_tags[i][1] == '.':
                    current_sentence['sentence'] = (
                        ' '.join(current_sentence['sentence'][:-1])
                        + current_sentence['sentence'][-1]
                    )
                else:
                    current_sentence['sentence'] = ' '.join(current_sentence['sentence']) + '.'

                quiz_sentences.append(current_sentence)

            current_sentence = {
                'sentence': [],
                'options': [],
                'answer': None
            }
            verb_index_data = [i + 1, []]

    return quiz_sentences
