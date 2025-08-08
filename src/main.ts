import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseSyncInterceptor } from './common/interceptors/database-sync.interceptor';
import { S3DatabaseService } from './config/s3-database.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const s3DatabaseService = app.get(S3DatabaseService);
  app.useGlobalInterceptors(new DatabaseSyncInterceptor(s3DatabaseService));

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

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
