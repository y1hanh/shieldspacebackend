import { Body, Controller, Post } from '@nestjs/common';
import {
  ActionResponse,
  AiEmotionsService,
  CustomActionInput,
} from './gemini.service';
import { Emotions } from 'src/emotions/emotions.controller';

// @UseGuards(AuthGuard)
@Controller('ai')
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}

  @Post('/action')
  async getAction(@Body() userInput: Emotions): Promise<ActionResponse> {
    return this.aiService.getAction(userInput.user_input);
  }

  @Post('/custom-action')
  async getCustomAction(
    @Body() userInput: CustomActionInput,
  ): Promise<ActionResponse> {
    return this.aiService.getCustomAction(userInput);
  }
}
