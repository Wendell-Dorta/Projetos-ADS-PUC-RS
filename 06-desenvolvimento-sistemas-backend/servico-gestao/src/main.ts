import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './infrastructure/http/modules/AppModule';
import { DomainExceptionFilter } from './infrastructure/http/filters/DomainExceptionFilter';
import { TransformInterceptor } from './infrastructure/http/interceptors/TransformInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 1. Logger Estruturado (Pino)
  app.useLogger(app.get(Logger));

  // 2. Segurança HTTP Headers (Helmet)
  app.use(helmet());

  // 3. CORS
  app.enableCors();

  // 4. Validação Global de Schemas DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 5. Filtro Global de Exceções de Domínio
  app.useGlobalFilters(new DomainExceptionFilter());

  // 6. Padronizador Global de Respostas HTTP (TransformInterceptor)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 7. Graceful Shutdown Hooks (SIGTERM/SIGINT)
  app.enableShutdownHooks();

  // 8. Swagger / OpenAPI Documentation setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ServicoGestao - API de Controle de Planos de Operadora')
    .setDescription(
      'Documentação interativa da API REST do Serviço Principal de Gestão de Planos, Clientes e Assinaturas (Fase 1).\n\n' +
        'Construído com NestJS + Arquitetura Limpa Rígida (Domain Value Objects, Monad Either e Token Symbols DI).',
    )
    .setVersion('1.0.0')
    .addTag('Clientes', 'Endpoints para consulta e gestão de clientes')
    .addTag('Planos', 'Endpoints para catálogo e alteração de planos')
    .addTag('Assinaturas', 'Endpoints para criação e filtragem de assinaturas')
    .addTag(
      'Health Check & Observabilidade',
      'Monitoramento da saúde da aplicação e banco de dados SQLite',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  await app.listen(PORT);

  const logger = app.get(Logger);
  logger.log(`====================================================`);
  logger.log(` ServicoGestao (NestJS + ConfigService + Clean Arch)`);
  logger.log(` Servidor ativo em: http://localhost:${PORT}`);
  logger.log(` Documentação Swagger UI: http://localhost:${PORT}/api-docs`);
  logger.log(` Health Check: http://localhost:${PORT}/health`);
  logger.log(` Prefixo 1 (Postman Template): http://localhost:${PORT}/gerenciaplanos`);
  logger.log(` Prefixo 2 (Documentação PDF): http://localhost:${PORT}/gestao`);
  logger.log(`====================================================`);
}

bootstrap();
