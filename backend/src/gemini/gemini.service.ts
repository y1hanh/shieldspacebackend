import { Candidate, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { fallbackResponse } from './utils';
import { log } from 'console';

type scriptResponse = {
  script: string[];
};

export type actionResponse = {
  'immediate-action': string[];
  'long-term-skills': string[];
};

export type Script = {
  user_input: string;
  role: 'parents' | 'teacher' | 'friends';
};

@Injectable()
export class AiEmotionsService {
  model = 'gemini-2.0-flash-001';
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async getAction(userInput: string): Promise<actionResponse> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    const config = {
      responseMimeType: 'text/plain',
      systemInstruction: [
        {
          text: `You are an empathetic and supportive AI assistant, specifically designed to help children handle hurtful online messages and foster emotional resilience. 
          Your task is to provide an action plan that addresses both the immediate emotional impact of the message and offers long-term strategies to build skills.
Do not include extra text, explanations. 
          Structure of the Response do not include asterisk (no more than 200 words):
1.Immediate Action
2.Long-Term Skills to Build`,
        },
      ],
    };

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: userInput,
          },
        ],
      },
    ];

    try {
      const { candidates } = await this.ai.models.generateContent({
        model: this.model,
        config,
        contents,
      });

      const content = candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!content.length || content.length < 30) {
        console.warn('Gemini returned a short or empty response');
        return fallbackResponse();
      }

      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');

      const indexOfSecond = lines.findIndex((line) => /^2\./.test(line));
      if (indexOfSecond === -1) {
        console.warn('Could not find section 2 in response');
        return fallbackResponse();
      }

      const immediate = lines.slice(1, indexOfSecond);
      const longTerm = lines.slice(indexOfSecond + 1);

      if (immediate.length === 0 || longTerm.length === 0) {
        console.warn('Parsed sections are empty');
        return fallbackResponse();
      }

      if (immediate.length > 4) {
        immediate.splice(4);
      }
      if (longTerm.length > 4) {
        longTerm.splice(4);
      }
      return {
        'immediate-action': immediate,
        'long-term-skills': longTerm,
      };
    } catch (error) {
      log('Error in getAction:', error);
      return fallbackResponse();
    }
  }

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
}
