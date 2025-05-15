import { Body, Controller, Post } from '@nestjs/common';
import {
  actionResponse,
  AiEmotionsService,
  customActionInput,
} from './gemini.service';
import { Emotions } from 'src/emotions/emotions.controller';

// @UseGuards(AuthGuard)
@Controller('ai')
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}

  @Post('/action')
  async getAction(@Body() userInput: Emotions): Promise<actionResponse> {
    return this.aiService.getAction(userInput.user_input);
  }

  @Post('/custom-action')
  async getCustomAction(
    @Body() userInput: customActionInput,
  ): Promise<actionResponse> {
    return this.aiService.getCustomAction(userInput);
  }
}
