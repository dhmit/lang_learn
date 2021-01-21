import nltk


def get_parts_of_speech_tags(text):
    tokens = nltk.word_tokenize(text)
    return nltk.pos_tag(tokens)


def get_part_of_speech_words(text, part):
    tags = {
        'noun': ['NN', 'NNS', 'NNP', 'NNPS'],
        'verb': ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'],
        'adverb': ['RB', 'RBR', 'RBS'],
        'adjective': ['JJ', 'JJR', 'JJS']
    }

    if part not in tags:
        return "Part of speech not valid"

    tokens = get_parts_of_speech_tags(text)
    return [token[0] for token in tokens if token[1] in tags[part]]
