import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { fallbackResponse, fallbackResponseCustom, getUserTags } from './utils';
import { log } from 'console';

export type ActionResponse = {
  'immediate-action': string[];
  'long-term-skills': string[];
};

export type CustomActionResponse = {
  'immediate-action': string[];
  'long-term-skills': string[];
  'coping-advice': string[];
  'encouraging-words': string[];
};

export type CustomActionInput = {
  userInput: string;
  userAnswers: string[];
};

@Injectable()
export class AiEmotionsService {
  model = 'gemini-2.0-flash-001';
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async getAction(userInput: string): Promise<ActionResponse> {
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
        throw new Error('Gemini returned a short or empty response');
      }

      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');
      console.log;
      const indexOfSecond = lines.findIndex((line) => /^2\./.test(line));
      if (indexOfSecond === -1) {
        throw new Error('Could not find section 2 in response');
      }

      const immediate = lines.slice(1, indexOfSecond);
      const longTerm = lines.slice(indexOfSecond + 1);

      if (immediate.length === 0 || longTerm.length === 0) {
        throw new Error('Parsed sections are empty');
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

  async getCustomAction(
    input: CustomActionInput,
  ): Promise<CustomActionResponse> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    const config = {
      responseMimeType: 'text/plain',
      systemInstruction: [
        {
          text: `You are an empathetic and supportive AI assistant, specifically designed to help children handle hurtful online messages and foster emotional resilience. 
          Your task is to provide an custom action plan based on user's emotion and bullying message that addresses the immediate emotional impact of the message, offers long-term strategies to build skills and coping advice, and encourage user.
Avoid repeating the tags or the bullying message directly.
Explain each action in an easy-to-understand and empathetic way, suitable for children aged 10-15.
Do not use asterisks (*), dashes (-), or Markdown formatting in your response.
Structure your response into:
1. Immediate Action
2. Long-Term Skills to Build
3. Coping Advice (strategies based on the user's choices)
4. Encouraging Words (motivation and positivity)`,
        },
      ],
    };

    const tags = getUserTags(input.userAnswers);

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `
            Bullying Message: "${input.userInput}"
            User's Emotional Tags:
- Emotion: ${tags[0]}
- Perceived Intent: ${tags[1]}
- Suggested Reaction (if sent to a friend): ${tags[2]}
- Past Exposure: ${tags[3]}
- Coping Strategy: ${tags[4]}`,
          },
        ],
      },
    ];

    console.log(
      `Bullying Message: "${input.userInput}"
            User's Emotional Tags:
- Emotion: ${tags[0]}
- Perceived Intent: ${tags[1]}
- Suggested Reaction (if sent to a friend): ${tags[2]}
- Past Exposure: ${tags[3]}
- Coping Strategy: ${tags[4]}`,
    );

    try {
      const { candidates } = await this.ai.models.generateContent({
        model: this.model,
        config,
        contents,
      });

      const content = candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!content.length || content.length < 30) {
        console.warn('Gemini returned a short or empty response');
        return fallbackResponseCustom();
      }

      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');

      const indexOfFirst = lines.findIndex((line) => /^1\./.test(line));
      const indexOfSecond = lines.findIndex((line) => /^2\./.test(line));
      const indexOfThird = lines.findIndex((line) => /^3\./.test(line));
      const indexOfLast = lines.findIndex((line) => /^4\./.test(line));
      if (indexOfSecond === -1 || indexOfThird === -1 || indexOfLast === -1) {
        console.warn('Could not find section 2 in response');
        return fallbackResponseCustom();
      }

      const immediate = lines.slice(indexOfFirst + 1, indexOfSecond);
      const longTerm = lines.slice(indexOfSecond + 1, indexOfThird);
      const copingAdvice = lines.slice(indexOfThird + 1, indexOfLast);
      const encouragingWords = lines.slice(indexOfLast + 1);

      if (
        immediate.length === 0 ||
        longTerm.length === 0 ||
        copingAdvice.length === 0 ||
        encouragingWords.length === 0
      ) {
        console.warn('Parsed sections are empty');
        return fallbackResponseCustom();
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
        'coping-advice': copingAdvice,
        'encouraging-words': encouragingWords,
      };
    } catch (error) {
      log('Error in getAction:', error);
      return fallbackResponseCustom();
    }
  }
}
