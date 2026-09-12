import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/infrastructure/http/modules/AppModule';
import { DomainExceptionFilter } from '../../src/infrastructure/http/filters/DomainExceptionFilter';
import { TransformInterceptor } from '../../src/infrastructure/http/interceptors/TransformInterceptor';

describe('Full Application Controllers (e2e)', () => {
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
      })
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health (deve retornar HTTP 200 e status UP do banco de dados)', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body.data.info.database.status).toBe('up');
  });

  it('GET /gerenciaplanos/planos (deve retornar a lista de planos)', async () => {
    const response = await request(app.getHttpServer())
      .get('/gerenciaplanos/planos')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('PATCH /gerenciaplanos/planos/:idPlano (deve atualizar o custo mensal de um plano existente)', async () => {
    const planosRes = await request(app.getHttpServer()).get('/gerenciaplanos/planos');
    const planoId = planosRes.body.data[0].codigo;

    const response = await request(app.getHttpServer())
      .patch(`/gerenciaplanos/planos/${planoId}`)
      .send({ custoMensal: 119.9 })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.custoMensal).toBe(119.9);
  });

  it('PATCH /gerenciaplanos/planos/:idPlano com custo negativo (deve retornar HTTP 400)', async () => {
    const planosRes = await request(app.getHttpServer()).get('/gerenciaplanos/planos');
    const planoId = planosRes.body.data[0].codigo;

    const response = await request(app.getHttpServer())
      .patch(`/gerenciaplanos/planos/${planoId}`)
      .send({ custoMensal: -50.0 })
      .expect(400);

    expect(response.body.message).toContain('O custo do plano não pode ser negativo');
  });

  it('PATCH /gerenciaplanos/planos/99999 (deve retornar HTTP 404)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/gerenciaplanos/planos/99999')
      .send({ custoMensal: 99.9 })
      .expect(404);

    expect(response.body.message).toContain('Plano com código 99999 não foi encontrado');
  });

  it('POST /gerenciaplanos/assinaturas (deve criar nova assinatura para cliente e plano existentes)', async () => {
    const clientesRes = await request(app.getHttpServer()).get('/gerenciaplanos/clientes');
    const planosRes = await request(app.getHttpServer()).get('/gerenciaplanos/planos');

    const cliId = clientesRes.body.data[0].codigo;
    const planoId = planosRes.body.data[0].codigo;

    const response = await request(app.getHttpServer())
      .post('/gerenciaplanos/assinaturas')
      .send({ codCli: cliId, codPlano: planoId, custoFinal: 99.9, descricao: 'Nova Assinatura E2E' })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.codCli).toBe(cliId);
    expect(response.body.data.codPlano).toBe(planoId);
  });

  it('GET /gerenciaplanos/assinaturas/ATIVOS (deve retornar apenas assinaturas ativas)', async () => {
    const response = await request(app.getHttpServer())
      .get('/gerenciaplanos/assinaturas/ATIVOS')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /gerenciaplanos/assinaturas/CANCELADOS (deve retornar assinaturas canceladas)', async () => {
    const response = await request(app.getHttpServer())
      .get('/gerenciaplanos/assinaturas/CANCELADOS')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /gerenciaplanos/assinaturas/TODOS (deve retornar todas as assinaturas)', async () => {
    const response = await request(app.getHttpServer())
      .get('/gerenciaplanos/assinaturas/TODOS')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /gerenciaplanos/asscli/:codcli (deve retornar assinaturas de um cliente existente)', async () => {
    const clientesRes = await request(app.getHttpServer()).get('/gerenciaplanos/clientes');
    const cliId = clientesRes.body.data[0].codigo;

    const response = await request(app.getHttpServer())
      .get(`/gerenciaplanos/asscli/${cliId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /gerenciaplanos/assinaturaplano/:codplano (deve retornar assinaturas de um plano existente)', async () => {
    const planosRes = await request(app.getHttpServer()).get('/gerenciaplanos/planos');
    const planoId = planosRes.body.data[0].codigo;

    const response = await request(app.getHttpServer())
      .get(`/gerenciaplanos/assinaturaplano/${planoId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
