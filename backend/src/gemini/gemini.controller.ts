import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { actionResponse, AiEmotionsService, Script } from './gemini.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Emotions } from 'src/emotions/emotions.controller';

@UseGuards(AuthGuard)
@Controller('ai')
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}

  @Post('/action')
  async getAction(@Body() userInput: Emotions): Promise<actionResponse> {
    return this.aiService.getAction(userInput.user_input);
  }
}
