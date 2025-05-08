import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiEmotionsService, Script } from './gemini.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Emotions } from 'src/emotions/emotions.controller';

@Controller('script')
export class AiEmotionsController {
  constructor(private readonly aiService: AiEmotionsService) {}

  // @UseGuards(AuthGuard)
  @Post('/')
  async getScript(@Body() userInput: Script): Promise<{}> {
    return this.aiService.getScript(userInput);
  }

  @Post('/education')
  async getEdu(@Body() userInput: Emotions): Promise<{}> {
    return this.aiService.getEdu(userInput.user_input);
  }
}
