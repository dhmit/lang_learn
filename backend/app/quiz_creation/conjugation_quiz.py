import nodebox_linguistics_extended as nle


def find_infinitive_form(verb_to_conjugate):
    """
    :param verb_to_conjugate:
    :return: the verb in the infinitive form
    """
    return nle.verb.infinitive(verb_to_conjugate)

def find_present_tense(verb_to_conjugate):
    """
    :param verb_to_conjugate
    :return: the verb in its present tense
    """
    return nle.verb.present(verb_to_conjugate)


