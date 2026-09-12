# Sistema de Controle de Planos e Faturamento de Operadora — Fase 2

**Disciplina:** Desenvolvimento de Sistemas Backend  
**Estudante:** Wendell de Souza Dorta  
**Matrícula:** 25250061-6  
**Ano:** 2026  

---

## 1. Visão Geral da Fase 2

Esta Fase 2 conclui o desenvolvimento do sistema distribuído com a implementação e integração de dois novos microsserviços ao serviço principal (`ServicoGestao`), orquestrados através de um **API Gateway** unificado e comunicando-se por meio do **Message Broker RabbitMQ** e eventos assíncronos:

1. **`api-gateway` (Porta 3000):**  
   Ponto de entrada único para todos os clientes e integrações externas (compatível 100% com o template do Postman). Atua como proxy reverso com suporte ao padrão **Circuit Breaker** (Aula 10) para isolamento de falhas, monitoramento de saúde agregado (`/health`) e logging de latência.

2. **`servico-gestao` (Porta 3001):**  
   Serviço principal desenvolvido com Arquitetura Limpa estrita e NestJS. Gerencia clientes, planos e contratos de assinaturas em seu banco relacional próprio (`dev.db` via Prisma ORM). Consome o evento assíncrono `PagamentoPlanoServicoGestao` via RabbitMQ para estender a validade da assinatura do cliente.

3. **`servico-faturamento` (Porta 3002):**  
   Microsserviço responsável pelo registro e gestão de cobranças e pagamentos. Possui banco de dados relacional totalmente isolado (`faturamento.db` via Prisma ORM). No endpoint `POST /registrarpagamento`, persiste o pagamento e emite os eventos assíncronos `PagamentoPlanoServicoGestao` e `PagamentoPlanoServicoPlanosAtivos` para o broker.

4. **`servico-planos-ativos` (Porta 3003):**  
   Microsserviço de altíssimo desempenho para responder se uma assinatura permanece ativa ou cancelada (`GET /planosativos/:codass`). Implementa o padrão **Cache-Aside** em memória com TTL: se a assinatura já estiver em cache (*Cache Hit*), responde instantaneamente; caso contrário (*Cache Miss*), consulta o `ServicoGestao`, popula o cache e responde. Consome o evento `PagamentoPlanoServicoPlanosAtivos` para invalidar a entrada em cache, garantindo consistência eventual imediata.

---

## 2. Estrutura do Projeto

```text
Wendell-Dorta-desenvol-sistemas-backend-fase-2/
├── api-gateway/                                    # Ponto de entrada unificado (Porta 3000)
│   ├── src/
│   │   ├── circuit-breaker.ts                      # Implementação do padrão Circuit Breaker
│   │   └── index.ts                                # Proxy reverso e rotas agregadas
│   ├── test/                                       # Testes automatizados do Gateway
│   ├── Dockerfile
│   └── package.json
├── servico-gestao/                                 # Serviço Principal (Porta 3001)
│   ├── prisma/                                     # Schema ORM, Migrações e Seed (dev.db)
│   ├── src/                                        # Arquitetura Limpa (Domain, UseCases, Adapters, Infra)
│   ├── test/                                       # 10 suítes / 23 testes automatizados (Jest)
│   ├── Dockerfile
│   └── package.json
├── servico-faturamento/                            # Microsserviço de Faturamento (Porta 3002)
│   ├── prisma/                                     # Banco isolado (faturamento.db)
│   ├── src/                                        # Domain, Application, Messaging (RabbitMQ Publisher)
│   ├── test/                                       # Testes de unidade do Caso de Uso
│   ├── Dockerfile
│   └── package.json
├── servico-planos-ativos/                          # Microsserviço de Cache e Alta Performance (Porta 3003)
│   ├── src/                                        # Cache-Aside, Consumer RMQ, HTTP Client
│   ├── test/                                       # Testes de Cache Hit/Miss e Invalidação
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml                              # Orquestração completa (RabbitMQ + 4 Serviços)
├── package.json                                    # Scripts raiz de execução e teste
├── Wendell_Dorta_Desenvolvimento_de_Sistemas_backend_Fase-2.postman_collection.json # Coleção Postman
├── Wendell_Dorta_relatório.pdf                     # Relatório Técnico Oficial em PDF
├── Wendell_Dorta_relatorio.docx                    # Relatório Técnico em DOCX
└── README.md                                       # Este guia de execução
```

---

## 3. Como Executar o Sistema

Você pode optar por executar o sistema de duas maneiras:

### Opção A: Execução Automática com Docker Compose (Recomendada)

Com o Docker Desktop aberto, execute na raiz da pasta do projeto:

```bash
docker compose up -d
```

Esse comando inicializa em containers isolados:
- **RabbitMQ Broker** (Portas `5672` e Painel Web em `15672` com user `guest` / senha `guest`);
- **ServicoGestao** (Porta `3001` com banco SQLite inicializado e seeded);
- **ServicoFaturamento** (Porta `3002` com banco SQLite isolado);
- **ServicoPlanosAtivos** (Porta `3003` com cache em memória);
- **API Gateway** (Porta `3000` roteando todas as requisições).

Para acompanhar os logs de todos os serviços:
```bash
docker compose logs -f
```

Para parar o ambiente:
```bash
docker compose down
```

---

### Opção B: Execução Local Standalone (Node.js & npm)

Caso deseje executar os serviços diretamente no sistema operacional:

#### 1. Pré-requisito
Certifique-se de ter Node.js (v18+) instalado.

#### 2. Inicializar os Bancos de Dados
Abra um terminal em cada pasta de serviço e execute a carga inicial:

```bash
# Terminal 1: ServicoGestao
cd servico-gestao
npm install
npm run setup     # Executa prisma generate, db push e carga inicial (seed)
npm run dev       # Inicia na porta 3001

# Terminal 2: ServicoFaturamento
cd servico-faturamento
npm install
npm run setup     # Executa prisma generate, db push e seed
npm run dev       # Inicia na porta 3002

# Terminal 3: ServicoPlanosAtivos
cd servico-planos-ativos
npm install
npm run dev       # Inicia na porta 3003

# Terminal 4: API Gateway
cd api-gateway
npm install
npm run dev       # Inicia na porta 3000
```

> **Nota sobre Mensageria e Tolerância a Falhas:**  
> Se o RabbitMQ estiver ativo localmente em `localhost:5672`, os microsserviços se conectarão automaticamente e farão a troca de eventos pelo broker AMQP. Se o RabbitMQ não estiver instalado na máquina do avaliador, os serviços continuam funcionando sem falhas através de um mecanismo de **resiliência com HTTP Webhook Fallback**, garantindo que todas as requisições do Postman passem com 100% de sucesso.

---

## 4. Como Testar com o Postman

1. Abra o software **Postman**.
2. Clique em **Import** e selecione o arquivo:  
   `Wendell_Dorta_Desenvolvimento_de_Sistemas_backend_Fase-2.postman_collection.json`.
3. Todas as requisições estão pré-configuradas para apontar para `http://localhost:3000` (porta do API Gateway).
4. Você pode executar individualmente cada requisição ou usar o **Collection Runner** para rodar todos os testes automatizados em lote.

### Endpoints Mapeados no API Gateway (Porta 3000)

| Pasta / Microsserviço | Método | Endpoint | Descrição |
|---|---|---|---|
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/clientes` | Lista os clientes cadastrados |
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/planos` | Lista os planos disponíveis |
| **ServicoGerenciamentoPlanos** | `POST` | `/gerenciaplanos/assinaturas` | Cadastra nova assinatura |
| **ServicoGerenciamentoPlanos** | `PATCH` | `/gerenciaplanos/planos/1` | Atualiza custo mensal de um plano |
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/assinaturas/ATIVOS` | Lista assinaturas com status ATIVO |
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/assinaturas/TODOS` | Lista todas as assinaturas |
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/assinaturas/CANCELADOS` | Lista assinaturas com status CANCELADO |
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/asscli/2` | Lista assinaturas do cliente 2 |
| **ServicoGerenciamentoPlanos** | `GET` | `/gerenciaplanos/assinaturaplano/2` | Lista assinaturas do plano 2 |
| **ServicoFaturamento** | `POST` | `/registrarpagamento` | Registra pagamento e gera eventos |
| **ServicoFaturamento** | `GET` | `/faturamento/pagamentos` | Consulta histórico de pagamentos |
| **ServicoPlanosAtivos** | `GET` | `/planosativos/:codass` | Retorna booleano rápido (`true`/`false`) |
| **ServicoPlanosAtivos** | `GET` | `/planosativos/cache/metricas` | Estatísticas do Cache (Hits/Misses) |
| **APIGateway_Observabilidade** | `GET` | `/health` | Health check agregado de todo o sistema |
| **APIGateway_Observabilidade** | `GET` | `/gateway/status` | Métricas e estado dos Circuit Breakers |

---

## 5. Bateria de Testes Automatizados

O sistema conta com **34 testes unitários e de integração** distribuídos entre os serviços:

```bash
# Executar todos os testes de unidade da aplicação:
npm run test:gestao        # 10 suítes / 23 testes (servico-gestao)
npm run test:faturamento   # 1 suíte / 4 testes (servico-faturamento)
npm run test:planos        # 1 suíte / 4 testes (servico-planos-ativos)
npm run test:gateway       # 1 suíte / 3 testes (api-gateway)
```

Todos os testes foram executados com **100% de sucesso**.
