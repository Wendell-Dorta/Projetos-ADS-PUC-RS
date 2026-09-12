import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/infrastructure/http/modules/AppModule';
import { DomainExceptionFilter } from '../../src/infrastructure/http/filters/DomainExceptionFilter';
import { TransformInterceptor } from '../../src/infrastructure/http/interceptors/TransformInterceptor';

describe('AssinaturaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /gerenciaplanos/clientes (deve retornar HTTP 200 com envelope de resposta formatado)', async () => {
    const response = await request(app.getHttpServer()).get('/gerenciaplanos/clientes').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.timestamp).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /gerenciaplanos/assinaturas com payload invalido (deve retornar HTTP 400 pelo ValidationPipe)', async () => {
    const response = await request(app.getHttpServer())
      .post('/gerenciaplanos/assinaturas')
      .send({ codCli: 'string_invalida' }) // codCli deve ser numero
      .expect(400);

    expect(response.body.message).toBeDefined();
  });

  it('POST /gerenciaplanos/assinaturas para cliente inexistente (deve retornar HTTP 404 pelo DomainExceptionFilter)', async () => {
    const response = await request(app.getHttpServer())
      .post('/gerenciaplanos/assinaturas')
      .send({ codCli: 99999, codPlano: 1, custoFinal: 50.0 })
      .expect(404);

    expect(response.body.message).toContain('Cliente com código 99999 não foi encontrado');
  });
});
