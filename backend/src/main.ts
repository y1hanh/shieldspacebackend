import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // app.use((req, res, next) => {
  //   res.removeHeader('X-Powered-By');
  //   res.removeHeader('Server');
  //   next();
  // });

  app.use(
    helmet({
      contentSecurityPolicy: false, // Already handled via Amplify frontend
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
