import nltk

def get_parts_of_speech_tags(text):
    tokens = nltk.word_tokenize("Can you please buy me an Arizona Ice Tea? It's $0.99.")
    return nltk.pos_tag(tokens)
