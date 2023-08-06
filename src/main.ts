import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SWAGGER_AUTH_SECURITY_SCHEMA } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    SWAGGER_AUTH_SECURITY_SCHEMA,
  )
    .setTitle('Todo app')
    .setDescription('The todo app API description')
    .setVersion('1.0')
    .addTag('todo')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5678);
}
bootstrap();
