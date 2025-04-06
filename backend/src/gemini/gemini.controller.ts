import { Body, Controller, Post } from '@nestjs/common';
import { AiEmotionsService } from './gemini.service';

export type Emotions = {
  transformer_emotions: string;
  nrc_emotions: string;
};

@Controller('ai')
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}
  @Post('emotions')
  async getAiEmo(@Body() { contents }): Promise<string[]> {
    return this.aiService.getEmo(contents);
  }
}
