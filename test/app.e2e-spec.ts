import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();

    // Login para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      })
      .expect(201);

    authToken = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/login (POST) - should login successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('token_type', 'Bearer');
      expect(response.body).toHaveProperty('expires_in', 86400);
    });

    it('/auth/login (POST) - should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Person V1 API', () => {
    const validPerson = {
      nome: 'João Silva Santos',
      sexo: 'masculino',
      email: 'joao@email.com',
      dataDeNascimento: '1990-01-15',
      naturalidade: 'São Paulo',
      nacionalidade: 'Brasileira',
      cpf: '11144477735',
    };

    it('/api/v1/pessoas (POST) - should create person successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/pessoas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validPerson)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(validPerson.nome);
      expect(response.body.cpf).toBe(validPerson.cpf);
    });

    it('/api/v1/pessoas (POST) - should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/pessoas')
        .send(validPerson)
        .expect(401);
    });

    it('/api/v1/pessoas (POST) - should fail with invalid CPF', async () => {
      const invalidPerson = { ...validPerson, cpf: '12345678901' };
      
      await request(app.getHttpServer())
        .post('/api/v1/pessoas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPerson)
        .expect(400);
    });

    it('/api/v1/pessoas (GET) - should list people', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/pessoas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
    });
  });

  describe('Person V2 API', () => {
    const validPersonV2 = {
      nome: 'Maria Silva Santos',
      sexo: 'feminino',
      email: 'maria@email.com',
      dataDeNascimento: '1990-01-15',
      naturalidade: 'São Paulo',
      nacionalidade: 'Brasileira',
      cpf: '25447772840',
      endereco: 'Rua das Flores, 123, Centro, São Paulo - SP',
    };

    it('/api/v2/pessoas (POST) - should create person with address', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v2/pessoas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validPersonV2)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(validPersonV2.nome);
      expect(response.body.endereco).toBe(validPersonV2.endereco);
    });

    it('/api/v2/pessoas (POST) - should fail without address', async () => {
      const { endereco, ...personWithoutAddress } = validPersonV2;
      
      await request(app.getHttpServer())
        .post('/api/v2/pessoas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(personWithoutAddress)
        .expect(400);
    });

    it('/api/v2/pessoas (GET) - should list people', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v2/pessoas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
    });
  });
});
