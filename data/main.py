from fastapi import FastAPI
from pydantic import BaseModel
from model import get_analysis


class Emotions(BaseModel):
    user_input: str


app = FastAPI()


@app.post("/emotions")
async def assess_emotions(emotion: Emotions):
    print("Received user input:", emotion)
    analysis = get_analysis(
        emotion.user_input)
    return {"analysis":  analysis}


@app.get("/")
async def getTest():

    return {"message": "Hello World"}
