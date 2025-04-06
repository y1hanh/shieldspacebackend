import { GenerateContentResponse, GoogleGenAI, Part } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { response } from 'express';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const model = {
  model: 'gemini-2.5-pro-exp-03-25',
  systemInstruction:
    'You are a tone and emotion analysis system for online messages.\nGiven a comment, return tone probabilities (0 to 1), most likely emotions impacted, and bullying-related metadata in JSON format.\nHere\'s the format:\n\njson\nCopy\nEdit\n{\n  "tone_scores": {\n    "Mocking": 0-1,\n    "Aggressive": 0-1,\n    "Sarcastic": 0-1,\n    "Supportive": 0-1,\n    "Neutral": 0-1\n  },\n  "bullying_likelihood": "<Low/Medium/High>",\n  "emotion_impact": ["<Likely user emotions>"],\n  "bullying_type": "<Optional - if any>",\n  "suggested_response": "<Comforting message>","coping_tip": "<Helpful suggestion>"\n}\nHere is the message:\n“{user_input}”',
};

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: 'text/plain',
};

@Injectable()
export class AiEmotionsService {
  async getEmo(contents: string): Promise<string[]> {
    const { candidates } = await ai.models.generateContent({
      model: model.model,
      contents,
      config: {
        systemInstruction: model.systemInstruction,
        ...generationConfig,
      },
    });
    const response: any[] = [];

    candidates?.forEach((candidate) => {
      const { content } = candidate;
      if (content?.parts?.[0]?.text) {
        response.push(content.parts[0]?.['text']);
      }
    });

    if (!response.length) {
      throw new Error('No response from AI');
    }
    return response;
  }
}
