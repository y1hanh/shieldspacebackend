# SURVEY AND MODEL
import nltk
from transformers import pipeline
from nrclex import NRCLex
import csv

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('vader_lexicon')
nltk.download('punkt_tab')

# Initialize the transformer-based emotion classifier (using CPU here)
emotion_classifier = pipeline(
   "text-classification",
    model='bhadresh-savani/distilbert-base-uncased-emotion',
    return_all_scores=True,
    # framework="pt",
    device=-1,
    top_k=None,
    truncation=True
)


def get_transformer_emotions(text):
    """Returns a dictionary mapping emotion labels to probabilities using the transformer model."""
    results = emotion_classifier(text)
    return {item['label']: item['score'] for item in results[0]}


def get_nrc_emotions(text):
    """Uses NRCLex to analyze the text and returns top emotions as a list of (emotion, score) tuples."""
    emotion_obj = NRCLex(text)
    return emotion_obj.top_emotions
