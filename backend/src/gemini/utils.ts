import { actionResponse, customActionResponse } from './gemini.service';

export function fallbackResponse(): actionResponse {
  return {
    'immediate-action': [
      'Acknowledge Feelings: "It\'s okay to feel upset or angry about this message. Your feelings are valid."',
      'Self-Compassion: "Remember, this person\'s words don\'t define your worth or abilities. You are capable and valuable."',
      'Take a Break: "Step away from the screen. Do something you enjoy, like listening to music or talking to someone you trust."',
      'Report/Block: "Report the comment to the platform and block the user to prevent further interaction."',
    ],
    'long-term-skills': [
      'Practice positive self-talk regularly.',
      'Develop Assertiveness: "Practice expressing your thoughts and feelings respectfully. Learn to stand up for yourself and others when faced with bullying."',
    ],
  };
}

export function fallbackResponseCustom(): customActionResponse {
  return {
    'immediate-action': [
      'Acknowledge Feelings: "It\'s okay to feel upset or angry about this message. Your feelings are valid."',
      'Self-Compassion: "Remember, this person\'s words don\'t define your worth or abilities. You are capable and valuable."',
      'Take a Break: "Step away from the screen. Do something you enjoy, like listening to music or talking to someone you trust."',
      'Report/Block: "Report the comment to the platform and block the user to prevent further interaction."',
    ],
    'long-term-skills': [
      'Practice positive self-talk regularly.',
      'Develop Assertiveness: "Practice expressing your thoughts and feelings respectfully. Learn to stand up for yourself and others when faced with bullying."',
    ],
    'coping-advice': [
      'Engage in activities that make you happy.',
      'Talk to someone you trust about how you feel.',
    ],
    'encouraging-words': [
      'You are not alone in this.',
      "Your feelings matter, and it's okay to seek help.",
    ],
  };
}

export const tagMapping = {
  0: {
    '1': 'happy',
    '2': 'confused',
    '3': 'sad',
    '4': 'angry',
    '5': 'scared',
  },
  1: {
    '1': 'joke',
    '2': 'unsure',
    '3': 'mean',
  },
  2: {
    '1': 'ignore',
    '2': 'tell_adult',
    '3': 'reply_angrily',
    '4': 'feel_bad',
  },
  3: {
    '1': 'never_seen',
    '2': 'few_times',
    '3': 'many_times',
  },
  4: {
    '1': 'block',
    '2': 'tell_parents',
    '3': 'joke_back',
    '4': 'keep_it_self',
  },
};

export function getUserTags(userAnswers: string[]): string[] {
  const tags: string[] = [];

  for (let i = 0; i < userAnswers.length; i++) {
    const tag = tagMapping[i][userAnswers[i]];
    if (tag) tags.push(tag);
  }

  return tags;
}
