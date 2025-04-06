import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmotionsModule } from './emotions/emotions.module';
import { AiEmotionsModule } from './gemini/gemini.module';

@Module({
  imports: [AuthModule, UsersModule, EmotionsModule, AiEmotionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
