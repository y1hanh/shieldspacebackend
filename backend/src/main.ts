import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Remove fingerprinting headers
  app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://apis.google.com"],
          styleSrc: [
            "'self'",
            'https://fonts.googleapis.com',
            "'unsafe-inline'",
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      referrerPolicy: { policy: 'no-referrer' },
      permissionsPolicy: {
        features: {
          camera: ['none'],
          microphone: ['none'],
          geolocation: ['none'],
        },
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
