import { Test, TestingModule } from '@nestjs/testing';
import { Body, Controller, INestApplication, Post } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApi } from '../src/config/configure-api';
import type { ApiEnvironmentConfig } from '../src/config/environment';

class ValidationRequest {
  @IsString()
  @MinLength(2)
  name!: string;
}

@Controller('test-validation')
class TestValidationController {
  @Post()
  validate(@Body() request: ValidationRequest): ValidationRequest {
    return request;
  }
}

const testConfig: ApiEnvironmentConfig = {
  environment: 'test',
  port: 3001,
  corsOrigins: ['http://localhost:3000'],
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestValidationController],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApi(app, testConfig);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('allows CORS requests from the configured frontend origin', () => {
    return request(app.getHttpServer())
      .options('/')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'GET')
      .expect(204)
      .expect('Access-Control-Allow-Origin', 'http://localhost:3000');
  });

  it('does not grant CORS access to unconfigured origins', () => {
    return request(app.getHttpServer())
      .options('/')
      .set('Origin', 'https://untrusted.example')
      .set('Access-Control-Request-Method', 'GET')
      .expect((response) => {
        expect(response.headers['access-control-allow-origin']).toBeUndefined();
      });
  });

  it('rejects invalid and unknown request fields without returning their values', () => {
    const secret = 'submitted-sensitive-value';

    return request(app.getHttpServer())
      .post('/test-validation')
      .send({ name: 1, password: secret })
      .expect(400)
      .expect((response) => {
        expect(JSON.stringify(response.body)).not.toContain(secret);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Bad Request',
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
