import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import { CircuitBreaker, CircuitState } from './circuit-breaker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const GESTAO_URL = process.env.SERVICO_GESTAO_URL || 'http://localhost:3001';
const FATURAMENTO_URL = process.env.SERVICO_FATURAMENTO_URL || 'http://localhost:3002';
const PLANOS_ATIVOS_URL = process.env.SERVICO_PLANOS_ATIVOS_URL || 'http://localhost:3003';

// Circuit Breakers para cada microsserviço (Padrão de Resiliência)
const gestaoBreaker = new CircuitBreaker('ServicoGestao', 5, 10000);
const faturamentoBreaker = new CircuitBreaker('ServicoFaturamento', 5, 10000);
const planosAtivosBreaker = new CircuitBreaker('ServicoPlanosAtivos', 5, 10000);

// Middlewares Globais de Segurança
app.use(helmet());
app.use(cors());

// Logger de Requisições
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[Gateway] ${req.method} ${req.originalUrl} -> HTTP ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});

// Middleware verificador de Circuit Breaker
const checkCircuit = (breaker: CircuitBreaker) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!breaker.canPass()) {
      return res.status(503).json({
        statusCode: 503,
        error: 'Service Unavailable',
        message: `O serviço '${breaker.name}' está temporariamente indisponível (Circuit Breaker OPEN). Tente novamente em instantes.`,
        circuitBreaker: breaker.getStats(),
      });
    }
    next();
  };
};

// ==============================================================================
// 1. ROTAS DIRETAS DO GATEWAY (Saúde, Métricas e Dashboard)
// ==============================================================================

app.get('/health', async (req: Request, res: Response) => {
  const checkService = async (name: string, url: string) => {
    try {
      const response = await axios.get(`${url}/health`, { timeout: 1500 });
      return { status: 'UP', statusCode: response.status, data: response.data };
    } catch (err: any) {
      return { status: 'DOWN', error: err?.message };
    }
  };

  const [gestao, faturamento, planosAtivos] = await Promise.all([
    checkService('ServicoGestao', GESTAO_URL),
    checkService('ServicoFaturamento', FATURAMENTO_URL),
    checkService('ServicoPlanosAtivos', PLANOS_ATIVOS_URL),
  ]);

  const allUp =
    gestao.status === 'UP' && faturamento.status === 'UP' && planosAtivos.status === 'UP';

  return res.status(allUp ? 200 : 207).json({
    status: allUp ? 'HEALTHY' : 'DEGRADED',
    gateway: {
      nome: 'API Gateway Unificado - Fase 2',
      porta: PORT,
      circuitBreakers: [
        gestaoBreaker.getStats(),
        faturamentoBreaker.getStats(),
        planosAtivosBreaker.getStats(),
      ],
    },
    downstreamServices: {
      servicoGestao: { url: GESTAO_URL, ...gestao },
      servicoFaturamento: { url: FATURAMENTO_URL, ...faturamento },
      servicoPlanosAtivos: { url: PLANOS_ATIVOS_URL, ...planosAtivos },
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/gateway/status', (req: Request, res: Response) => {
  return res.json({
    gateway: 'API Gateway Unificado',
    rotas: {
      gestao: ['/gerenciaplanos/*', '/gestao/*'],
      faturamento: ['/registrarpagamento', '/faturamento/*'],
      planosAtivos: ['/planosativos/*'],
    },
    circuitBreakers: [
      gestaoBreaker.getStats(),
      faturamentoBreaker.getStats(),
      planosAtivosBreaker.getStats(),
    ],
  });
});

// ==============================================================================
// 2. PROXIES REVERSOS PARA OS MICROSSERVIÇOS
// ==============================================================================

// Proxy para ServicoGestao (:3001)
const gestaoProxy = createProxyMiddleware({
  target: GESTAO_URL,
  changeOrigin: true,
  onProxyRes: (proxyRes) => {
    if (proxyRes.statusCode && proxyRes.statusCode < 500) {
      gestaoBreaker.recordSuccess();
    }
  },
  onError: (err, req, res) => {
    gestaoBreaker.recordFailure();
    console.error(`[Gateway Proxy Error -> ServicoGestao]: ${err.message}`);
    (res as Response).status(503).json({
      statusCode: 503,
      error: 'Service Unavailable',
      message: 'Não foi possível se conectar ao ServicoGestao (porta 3001).',
      detail: err.message,
    });
  },
});

// Proxy para ServicoFaturamento (:3002)
const faturamentoProxy = createProxyMiddleware({
  target: FATURAMENTO_URL,
  changeOrigin: true,
  onProxyRes: (proxyRes) => {
    if (proxyRes.statusCode && proxyRes.statusCode < 500) {
      faturamentoBreaker.recordSuccess();
    }
  },
  onError: (err, req, res) => {
    faturamentoBreaker.recordFailure();
    console.error(`[Gateway Proxy Error -> ServicoFaturamento]: ${err.message}`);
    (res as Response).status(503).json({
      statusCode: 503,
      error: 'Service Unavailable',
      message: 'Não foi possível se conectar ao ServicoFaturamento (porta 3002).',
      detail: err.message,
    });
  },
});

// Proxy para ServicoPlanosAtivos (:3003)
const planosAtivosProxy = createProxyMiddleware({
  target: PLANOS_ATIVOS_URL,
  changeOrigin: true,
  onProxyRes: (proxyRes) => {
    if (proxyRes.statusCode && proxyRes.statusCode < 500) {
      planosAtivosBreaker.recordSuccess();
    }
  },
  onError: (err, req, res) => {
    planosAtivosBreaker.recordFailure();
    console.error(`[Gateway Proxy Error -> ServicoPlanosAtivos]: ${err.message}`);
    (res as Response).status(503).json({
      statusCode: 503,
      error: 'Service Unavailable',
      message: 'Não foi possível se conectar ao ServicoPlanosAtivos (porta 3003).',
      detail: err.message,
    });
  },
});

// Registro das Rotas do Gateway
app.use('/gerenciaplanos', checkCircuit(gestaoBreaker), gestaoProxy);
app.use('/gestao', checkCircuit(gestaoBreaker), gestaoProxy);
app.use('/registrarpagamento', checkCircuit(faturamentoBreaker), faturamentoProxy);
app.use('/faturamento', checkCircuit(faturamentoBreaker), faturamentoProxy);
app.use('/planosativos', checkCircuit(planosAtivosBreaker), planosAtivosProxy);

// Fallback 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: `A rota ${req.method} ${req.url} não foi encontrada no API Gateway.`,
    endpointsDisponiveis: [
      'GET /gerenciaplanos/clientes',
      'GET /gerenciaplanos/planos',
      'POST /gerenciaplanos/assinaturas',
      'PATCH /gerenciaplanos/planos/:idPlano',
      'GET /gerenciaplanos/assinaturas/ATIVOS',
      'GET /gerenciaplanos/assinaturas/TODOS',
      'GET /gerenciaplanos/assinaturas/CANCELADOS',
      'GET /gerenciaplanos/asscli/:codcli',
      'GET /gerenciaplanos/assinaturaplano/:codplano',
      'POST /registrarpagamento',
      'GET /planosativos/:codass',
      'GET /health',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` API Gateway Unificado (Porta ${PORT})`);
  console.log(` Roteando para:`);
  console.log(`   - ServicoGestao:       ${GESTAO_URL}`);
  console.log(`   - ServicoFaturamento:  ${FATURAMENTO_URL}`);
  console.log(`   - ServicoPlanosAtivos: ${PLANOS_ATIVOS_URL}`);
  console.log(` Ponto de entrada unificado para o template do Postman!`);
  console.log(`====================================================`);
});
