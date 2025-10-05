import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './commons/interceptors/response-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Career Buzz AI API v1')
    .setDescription(
      'Career Buzz AI API Documentation - Version 1.0\n\nBase URL: /api/v1\n\nEndpoints:\n- Authentication: /api/v1/user/*\n- Health Check: /health\n- API Docs: /api/api-docs',
    )
    .setVersion('1.0')
    .addServer('http://localhost:4000', 'Development server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
