import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiEmotionsService } from './gemini.service';
import { AuthGuard } from 'src/auth/auth.guard';

export type Emotions = {
  transformer_emotions: string;
  nrc_emotions: string;
};

@Controller('ai')
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}

  @UseGuards(AuthGuard)
  @Post('emotions')
  async getAiEmo(@Body() { contents }): Promise<{}> {
    return this.aiService.getEmo(contents);
  }
}
