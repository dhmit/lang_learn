import random


def apply(question_option):
    sentence_list = question_option['text'].split('. ')
    sentence_index = random.randint(0, len(sentence_list) - 1)
    new_sentence = sentence_list[sentence_index][0].lower() + sentence_list[sentence_index][1:]
    sentence_list[sentence_index] = new_sentence
    new_option = {
        'error-types': question_option['error-types'] + ['capitalization'],
        'text': '. '.join(sentence_list)
    }
    return new_option, True
