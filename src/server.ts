import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverlessExpress from '@vendia/serverless-express';
import { Handler, Context, APIGatewayProxyEvent } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API de Cadastro de Pessoas')
    .setDescription('API para gerenciamento de cadastro de pessoas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [],
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback?: any,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
