import { Module } from '@nestjs/common';
import { AiEmotionsController } from './gemini.controller';
import { AiEmotionsService } from './gemini.service';

@Module({
  providers: [AiEmotionsService],
  controllers: [AiEmotionsController],
})
export class AiEmotionsModule {}
