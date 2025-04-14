import { Module } from '@nestjs/common';
import { EmotionsModule } from './emotions/emotions.module';
import { AiEmotionsModule } from './gemini/gemini.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VisualizationModule } from './visualization/visualization.module';
import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: process.env.USER_POOL_ID as string,
        clientId: process.env.CLIENT_ID,
        tokenUse: null,
      },
    }),
    EmotionsModule,
    AiEmotionsModule,
    AuthModule,
    VisualizationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
