from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from self_assessment_model import get_transformer_emotions, get_nrc_emotions

class Emotions(BaseModel):
    transformer_emotions: str
    nrc_emotions: str

app = FastAPI()

@app.post("/emotions")
async def assess_emotions(emotion: Emotions):
    transformer_emotions = get_transformer_emotions(emotion.transformer_emotions)
    nrc_emotions = get_nrc_emotions(emotion.nrc_emotions)
    return {"transformer_emotions": transformer_emotions, "nrc_emotions": nrc_emotions}