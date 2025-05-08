import {
  Candidate,
  GenerateContentResponse,
  GoogleGenAI,
  Type,
} from '@google/genai';
import { Injectable } from '@nestjs/common';
import { response } from 'express';

type scriptResponse = {
  script: string[];
};
export type Script = {
  user_input: string;
  role: 'parents' | 'teacher' | 'friends';
};
@Injectable()
export class AiEmotionsService {
  model = 'gemini-2.0-flash-001';
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async getScript(userInput: Script): Promise<scriptResponse> {
    const config = {
      responseMimeType: 'text/plain',
      systemInstruction: [
        {
          text: `You are a 12 years old kids and you being bullied online. The bullie message is ${userInput}.
          You are not sure what to do and do not know if you should tell your ${userInput.role || 'parents'}.
          you decide to message your ${userInput.role || 'parents'}. What is your message.`,
        },
      ],
    };

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: userInput.user_input,
          },
        ],
      },
    ];

    const { candidates } = await this.ai.models.generateContent({
      model: this.model,
      config,
      contents,
    });

    let response: string[] = [];
    const { content } = candidates?.[0] as Candidate;

    if (content?.parts?.[0]?.text) {
      response = content.parts[0]?.['text']
        .split('\n')
        .filter((line) => line.trim() !== '');
    }

    if (!Object.entries(response).length) {
      throw new Error('No response from AI');
    }
    return { script: response };
  }

  async getEdu(userInput: string): Promise<any> {
    return {};
  }
}
