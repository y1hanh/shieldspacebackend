import { actionResponse } from './gemini.service';

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
