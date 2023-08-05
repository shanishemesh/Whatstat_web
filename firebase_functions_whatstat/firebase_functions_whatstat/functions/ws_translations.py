from textblob import TextBlob
from googletrans import Translator

def translate_to_english(text):
    translator = Translator()
    translated_text = translator.translate(text, dest='en')
    return translated_text.text