import { GenerateContentResponse, GoogleGenAI, Type } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { response } from 'express';

const model = {
  model: 'gemini-2.5-pro-exp-03-25',
  systemInstruction:
    'You are a tone and emotion analysis system for online messages.\nGiven a comment, return tone probabilities (0 to 1), most likely emotions impacted, and bullying-related metadata in JSON format.\nHere\'s the format:\n\njson\nCopy\nEdit\n{\n  "tone_scores": {\n    "Mocking": 0-1,\n    "Aggressive": 0-1,\n    "Sarcastic": 0-1,\n    "Supportive": 0-1,\n    "Neutral": 0-1\n  },\n  "bullying_likelihood": "<Low/Medium/High>",\n  "emotion_impact": ["<Likely user emotions>"],\n  "bullying_type": "<Optional - if any>"\n}\nHere is the message:\n“{user_input}”',
};

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: 'application/json',
};

@Injectable()
export class AiEmotionsService {
  async getEmo(contents: string): Promise<{}> {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    const { candidates } = await ai.models.generateContent({
      model: model.model,
      contents,
      config: {
        systemInstruction: model.systemInstruction,
        ...generationConfig,
      },
    });
    let response: {} = {};

    candidates?.forEach((candidate) => {
      const { content } = candidate;
      if (content?.parts?.[0]?.text) {
        response = JSON.parse(content.parts[0]?.['text']);
      }
    });

    if (!Object.entries(response).length) {
      throw new Error('No response from AI');
    }
    return response;
  }
}
