# import textwrap
# import nltk
import torch
from huggingface_hub import hf_hub_download
from transformers import (
    pipeline,
    AutoTokenizer,
    AutoConfig,
    AutoModelForSequenceClassification,
    TextClassificationPipeline,
)

# Download necessary NLTK data
# nltk.download('punkt')
# nltk.download('vader_lexicon')

# --------------------- Initialize Models ---------------------
# Emotion analysis model using SamLowe's GoEmotions model for improved emotion detection
emotion_classifier = pipeline(
    "text-classification",
    model="SamLowe/roberta-base-go_emotions",
    top_k=None,         # Return all scores then we'll pick the top 5
    truncation=True
)

# Toxicity detection model using Toxic-BERT
toxicity_classifier = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=None,
    truncation=True
)

# ── 3. Sexism / Racism detector built from raw .pth  ────────────
REPO_ID = "jkos0012/sexism_racism_bert_model"
PT_FILE = "sexism_racism_bert_model.pth"
TOKENIZER_ID = "bert-base-uncased"
LABELS = ["sexism", "racism"]

# 3‑A  download the .pth checkpoint once and load it
ckpt_path = hf_hub_download(REPO_ID, filename=PT_FILE)
state_dict = torch.load(ckpt_path, map_location="cpu")

# 3‑B  build a compatible BERT config with num_labels=2
config = AutoConfig.from_pretrained(
    TOKENIZER_ID,
    num_labels=len(LABELS),
    id2label=dict(enumerate(LABELS)),
    label2id={l: i for i, l in enumerate(LABELS)},
)

# 3‑C  recreate the classification model and load weights
bias_model = AutoModelForSequenceClassification.from_config(config)
missing, unexpected = bias_model.load_state_dict(state_dict, strict=False)
assert not missing,  f"Missing weights! {missing}"
assert not unexpected, f"Unexpected keys! {unexpected}"

# 3‑D  wrap in a normal pipeline (sigmoid = multi‑label)
bias_classifier = TextClassificationPipeline(
    model=bias_model,
    tokenizer=AutoTokenizer.from_pretrained(TOKENIZER_ID),
    function_to_apply="sigmoid",
    top_k=None,
)
# --------------------- Helper Functions ---------------------


def get_bias_scores(text: str) -> dict:
    return {r["label"]: r["score"] for r in bias_classifier(text)[0]}


def get_transformer_emotions(text):
    """
    Uses the GoEmotions model to compute emotion scores.
    Returns the top 5 emotions (sorted by score) as a dictionary.
    """
    results = emotion_classifier(text)[0]
    # Sort the results in descending order by score, and take the top 5 entries
    sorted_results = sorted(
        results, key=lambda x: x['score'], reverse=True)[:5]
    return {item['label']: "{:.3f}".format(item['score']) for item in sorted_results}


def get_toxicity_score(text):
    """
    Uses the Toxic-BERT model to compute toxicity scores.
    Returns a dictionary mapping each toxicity label to its score.
    """
    results = toxicity_classifier(text)[0]
    return {item['label']: "{:.3f}".format(item['score']) for item in results}


def display_analysis(message):
    """
    Performs and displays both emotion analysis (top 5) and toxicity analysis
    with friendly labels and detected tags.
    """
    # Emotion Analysis
    emotions = get_transformer_emotions(message)
    trigger_emotion = max(emotions, key=emotions.get)

    # Toxicity Analysis
    toxicity = get_toxicity_score(message)
    toxic_level = toxicity.get('toxic', 0.0)

    bias = get_bias_scores(message)
    return {
        "toxic_level": toxic_level,
        "toxicity": toxicity,
        "emotions": emotions,
        "trigger_emotion": trigger_emotion,
        "bias": bias,
    }
