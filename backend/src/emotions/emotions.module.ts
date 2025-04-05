import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmotionsController } from './emotions.controller';

@Module({
  imports: [HttpModule],
  controllers: [EmotionsController],
})
export class EmotionsModule {}
