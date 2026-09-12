import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './DatabaseModule';
import { ClienteModule } from './ClienteModule';
import { PlanoModule } from './PlanoModule';
import { AssinaturaModule } from './AssinaturaModule';
import { HealthModule } from './HealthModule';
import { envValidationSchema } from '../config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'info' : 'info',
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    ClienteModule,
    PlanoModule,
    AssinaturaModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
