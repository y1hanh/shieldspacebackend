import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmotionsModule } from './emotions/emotions.module';

@Module({
  imports: [AuthModule, UsersModule, EmotionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
