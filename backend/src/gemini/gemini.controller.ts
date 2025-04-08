import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiEmotionsService } from './gemini.service';
import { AuthGuard } from 'src/auth/auth.guard';

export type Emotions = {
  transformer_emotions: string;
  nrc_emotions: string;
};

@Controller()
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}

  @UseGuards(AuthGuard)
  @Post('emotions')
  async getAiEmo(@Body() body): Promise<{}> {
    const contents = body.transformer_emotions;
    return this.aiService.getEmo(contents);
  }
}
