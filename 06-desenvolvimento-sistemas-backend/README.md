# Projeto de Desenvolvimento de Sistemas Backend - Fase 1

## Sistema de Controle de Planos de Operadora (`ServicoGestao` - NestJS & Clean Architecture Rígida)

Este repositório contém a entrega da **Fase 1** da disciplina **Desenvolvimento de Sistemas Backend**.
O módulo principal `servico-gestao` foi desenvolvido utilizando o framework **NestJS** aliado a uma **Arquitetura Limpa (Clean Architecture)** rigorosa proposta por Robert C. Martin (Uncle Bob), princípios **SOLID** e padrões de projeto (**Repository Pattern**, **DTO/Mapper Pattern**, **Factory Provider (`useFactory`)** e **Global Exception Filter**).

---

## 📁 Estrutura de Arquivos da Entrega

```
estudante-desenvol-sistemas-backend-fase-1/
├── servico-gestao/                  # Código-fonte do Serviço Principal (NestJS + Clean Arch Rígida)
│   ├── prisma/                      # Schema do Prisma ORM e Script de Seeding (SQLite)
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/                         # Camadas da Arquitetura Limpa
│   │   ├── domain/                  # Entidades (Cliente, Plano, Assinatura), Repositórios e Erros de Domínio (Pure TS)
│   │   ├── application/             # DTOs de Input/Output e Casos de Uso Puros (Pure TS sem @Injectable)
│   │   ├── adapters/                # Mappers estáticos de conversão para DTOs
│   │   └── infrastructure/          # NestJS Controllers, Módulos (useFactory), DTOs (class-validator), Exception Filter e Prisma
│   ├── package.json
│   └── tsconfig.json
├── estudante_relatorio.pdf          # Documento PDF completo com Arquitetura, UML, SOLID e Conclusão
├── estudante_Desenvolvimento_de_Sistemas_backend_Fase-1.postman_collection.json  # Coleção do Postman
└── README.md                        # Orientações rápidas de execução
```

---

## 🚀 Passo a Passo para Inicialização e Execução

### Pré-requisitos
- **Node.js**: v18 ou superior.
- **npm**: v9 ou superior.

### 1. Entrar na pasta do serviço de gestão:
```bash
cd servico-gestao
```

### 2. Instalar as dependências:
```bash
npm install --legacy-peer-deps
```

### 3. Executar a configuração automatizada do Banco de Dados (Gerar Prisma Client, sincronizar schema no SQLite e executar Seeding):
```bash
npm run setup
```
> **Nota sobre o Banco de Dados:** O sistema utiliza **SQLite** (banco de dados baseado em arquivo local `dev.db`), dispensando a necessidade de instalar ou configurar servidores externos de banco de dados.

O script de seeding popula automaticamente a base com:
- **10 clientes**
- **5 planos**
- **6 assinaturas** (com status calculados entre `ATIVO` e `CANCELADO`)

### 4. Iniciar o servidor da aplicação em modo de desenvolvimento:
```bash
npm run dev
```
O servidor NestJS estará ativo em: **`http://localhost:3000`**.

---

## 🧪 Endpoints e Testes no Postman

O servidor NestJS suporta ambos os prefixos para garantir 100% de compatibilidade com o template Postman e com a especificação em PDF:
- **Prefix 1 (Postman Collection):** `http://localhost:3000/gerenciaplanos/...`
- **Prefix 2 (Documentação PDF):** `http://localhost:3000/gestao/...`

### Principais Rotas:
- **`GET /gerenciaplanos/clientes`** - Lista todos os clientes cadastrados.
- **`GET /gerenciaplanos/planos`** - Lista todos os planos cadastrados.
- **`POST /gerenciaplanos/assinaturas`** - Cria uma nova assinatura com validação de DTO.
- **`PATCH /gerenciaplanos/planos/:idPlano`** - Atualiza o custo mensal de um plano.
- **`GET /gerenciaplanos/assinaturas/{tipo}`** - Filtra assinaturas por tipo (`TODOS`, `ATIVOS`, `CANCELADOS`).
- **`GET /gerenciaplanos/asscli/:codcli`** - Lista assinaturas de um cliente específico.
- **`GET /gerenciaplanos/assinaturaplano/:codplano`** - Lista assinaturas de um plano específico.

### Testando no Postman:
Importe o arquivo `estudante_Desenvolvimento_de_Sistemas_backend_Fase-1.postman_collection.json` no Postman. Todas as requisições estão pré-configuradas com os corpos em JSON.

---

## 📄 Documentação Técnica (PDF)

Consulte o arquivo **`estudante_relatorio.pdf`** para a análise detalhada contendo:
1. Diagrama de Classes e Módulos em PlantUML.
2. Explicação concisa da separação em 4 camadas (`domain`, `application`, `adapters`, `infrastructure`).
3. Demonstração prática do uso do padrão `useFactory` nos Módulos NestJS para manter Use Cases como TypeScript puro sem `@Injectable()`.
4. Demonstração prática da aplicação de cada um dos 5 princípios **SOLID**.
5. Padrões de Projeto (Repository, DTO/Mapper, Global Exception Filter).
6. Seção de Conclusão e desafios resolvidos na Fase 1.
