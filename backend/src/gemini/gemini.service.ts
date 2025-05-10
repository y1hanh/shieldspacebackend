import { Candidate, GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

type scriptResponse = {
  script: string[];
};

type actionResponse = {
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

  async getAction(userInput: string): Promise<actionResponse> {
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

    const { candidates } = await this.ai.models.generateContent({
      model: this.model,
      config,
      contents,
    });

    let response: actionResponse = {
      'immediate-action': [],
      'long-term-skills': [],
    };

    const { content } = candidates?.[0] as Candidate;

    if (content?.parts?.[0]?.text) {
      const current = content.parts[0]?.['text']
        .split('\n')
        .filter((line) => line.trim() !== '');

      let indexOfSecond = 0;
      current.forEach((line, index) => {
        if (line.includes('2.')) {
          indexOfSecond = index;
        }
      });
      const firstPart = current.slice(1, indexOfSecond);
      const secondPart = current.slice(indexOfSecond + 1);
      response = {
        'immediate-action': firstPart,
        'long-term-skills': secondPart,
      };
    }

    if (!Object.entries(response).length) {
      throw new Error('No response from AI');
    }
    return response;
  }
}
