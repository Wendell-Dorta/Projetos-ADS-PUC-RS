# 🎓 Projetos Acadêmicos — Análise e Desenvolvimento de Sistemas (PUC-RS)

Este repositório reúne em formato de **Monorepo** os projetos práticos e acadêmicos desenvolvidos por **Wendell de Souza Dorta** durante a graduação em **Análise e Desenvolvimento de Sistemas (ADS)** na **Pontifícia Universidade Católica do Rio Grande do Sul (PUC-RS)**.

---

## 🏛️ Filosofia de Estruturação e Versionamento

O repositório foi concebido para manter a máxima limpeza e aderência às melhores práticas de engenharia de software:

1. **Diretórios Limpos**: Todo o código-fonte executável reside diretamente na raiz de cada pasta de disciplina (`0X-<disciplina>/`), sem diretórios intermediários de fases (`Fase-1`/`Fase-2`).
2. **Histórico Evolutivo via Git**: A evolução acadêmica entre a Fase 1 (requisitos fundamentais) e a Fase 2 (evolução técnica e arquitetural) está registrada diretamente no histórico de commits via **Conventional Commits** e commits de responsabilidade única.
3. **Código Limpo & Zero Binários**: Repositório focado exclusivamente em código-fonte, configurações, modelos lógicos/conceituais e dados, sem inclusão de arquivos `.pdf`, `.docx`, `.zip` ou dependências pesadas (`node_modules`).
4. **Isolamento de Ambientes**: Cada projeto possui seu próprio `.gitignore`, documentação técnica independente e arquivos de template de variáveis de ambiente (`.env.example`).

---

## 📚 Matriz de Projetos Curriculares

| # | Disciplina / Projeto | Stack Tecnológica | Arquitetura / Destaques |
|---|---|---|---|
| **01** | [**01-logica-programacao**](./01-logica-programacao/) | Python, Pandas, Matplotlib, Jupyter Notebook | Análise de dados climáticos, cálculo estatístico e exploração via notebook interativo. |
| **02** | [**02-programacao-orientada-a-objetos**](./02-programacao-orientada-a-objetos/) | JavaScript (ES6+), Node.js | Jogo text-adventure RPG implementando Encapsulamento, Polimorfismo e Design by Contract. |
| **03** | [**03-banco-de-dados**](./03-banco-de-dados/) | Oracle SQL / ANSI SQL, brModelo 3.0, JSON | Modelagem conceitual e lógica (3FN), scripts DDL de criação, DML de povoamento e DQL com JOINs complexos. |
| **04** | [**04-fundamentos-sistemas-web**](./04-fundamentos-sistemas-web/) | HTML5 semântico, CSS3 customizado, Bootstrap 5, Vanilla JS | Plataforma e-commerce e serviços 'Mundo Pet' com formulário multi-etapas e vitrine interativa. |
| **05** | [**05-desenvolvimento-sistemas-frontend**](./05-desenvolvimento-sistemas-frontend/) | Next.js 15, TypeScript, TailwindCSS, React Query, Cypress, Jest | SPA para rastreamento de séries de TV (TVMaze API), testes E2E e unitários, cache assíncrono e tema dinâmico. |
| **06** | [**06-desenvolvimento-sistemas-backend**](./06-desenvolvimento-sistemas-backend/) | Node.js, NestJS, TypeScript, Prisma ORM, RabbitMQ, Docker | Ecossistema distribuído de microsserviços (Gestão, Faturamento, Planos Ativos, API Gateway, Circuit Breaker). |

---

## 🛠️ Detalhes dos Projetos

### 01. Lógica e Programação de Computadores
* **Objetivo**: Aplicação prática de estruturas de dados e controle, funções, manipulação de arquivos e análise exploratória de dados tabulares.
* **Artefatos**: Script Python funcional (`projeto-fase-um.py`) e notebook analítico estruturado (`projeto_fase_dois.ipynb`).

### 02. Programação Orientada a Objetos
* **Objetivo**: Modelagem de domínio orientada a objetos (classes, herança, polimorfismo, invariantes de classe) em um jogo interativo de exploração.
* **Artefatos**: Motor de jogo em JavaScript modular com validação de pré/pós-condições em tempo de execução.

### 03. Banco de Dados Relacional
* **Objetivo**: Construção completa de banco relacional para controle de construtoras, obras, operários e alocação de maquinário pesado.
* **Artefatos**: Modelos `.brM3` conceituais e lógicos, scripts SQL idempotentes de criação, população e consultas analíticas.

### 04. Fundamentos de Sistemas Web
* **Objetivo**: Construção de interface web moderna, responsiva e acessível para a loja e clínica veterinária *Mundo Pet*.
* **Artefatos**: Catálogo de produtos com filtragem por tags, página inicial com carrossel dinâmico, cadastro de cliente/pet em múltiplos passos.

### 05. Desenvolvimento de Sistemas Frontend
* **Objetivo**: Criação de aplicação Next.js 15 (App Router) conectada à TVMaze API com alta performance e confiabilidade.
* **Artefatos**: Cobertura de testes automatizados (Jest + Testing Library + Cypress E2E), gestão de estado via TanStack Query e componentes acessíveis.

### 06. Desenvolvimento de Sistemas Backend
* **Objetivo**: Implementação de arquitetura de microsserviços orientada a eventos para gestão de assinaturas, cobrança e planos ativos.
* **Artefatos**:
  - `api-gateway`: Proxy unificado com Circuit Breaker pattern.
  - `servico-gestao`: Domínio central de clientes e assinaturas com Prisma ORM e SQLite.
  - `servico-faturamento`: Processamento assíncrono de cobranças e publicação em filas RabbitMQ.
  - `servico-planos-ativos`: Consulta ultra-rápida com cache em memória e invalidação orientada a eventos.
  - `docker-compose.yml`: Orquestração de RabbitMQ e serviços auxiliares.

---

## 🚀 Como Explorar e Executar

Cada diretório possui seu próprio arquivo `README.md` detalhado com instruções de instalação, configuração de ambiente e comandos de execução. Consulte o README individual para detalhes específicos:

```bash
# Clone este repositório
git clone https://github.com/Wendell-Dorta/Projetos-ADS-PUC-RS.git

# Acesse o projeto desejado, por exemplo:
cd Projetos-ADS-PUC-RS/06-desenvolvimento-sistemas-backend
```

---

## 👤 Autor

**Wendell de Souza Dorta**  
- Estudante de Análise e Desenvolvimento de Sistemas — PUC-RS
- GitHub: [@Wendell-Dorta](https://github.com/Wendell-Dorta)

---

## 📄 Licença

Este repositório é distribuído sob os termos da licença [MIT](./LICENSE).
