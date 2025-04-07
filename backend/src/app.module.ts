import { Module } from '@nestjs/common';
import { EmotionsModule } from './emotions/emotions.module';
import { AiEmotionsModule } from './gemini/gemini.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EmotionsModule,
    AiEmotionsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
