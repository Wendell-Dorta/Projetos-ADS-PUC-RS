# 03 - Banco de Dados Relacional (SGBD)

Este projeto compreende a modelagem conceitual, projeto lógico relacional e implementação SQL completa para um sistema de gestão de construtoras, obras, equipamentos e trabalhadores.

## 📌 Visão Geral da Arquitetura de Dados

O banco de dados foi projetado seguindo as melhores práticas de normalização relacional (3FN) e integridade referencial:
- **Construtoras & Telefones**: Entidades principais com suporte a múltiplos telefones (1:N cascade).
- **Categorias & Equipamentos**: Catálogo categorizado de maquinário e ferramentas com precificação por diária de uso.
- **Obras**: Projetos civis vinculados à construtora executora com controle geográfico/endereço.
- **Trabalhadores**: Mão de obra alocada em cada obra com controle de folha de pagamento / salários via CPF.
- **Alocação**: Tabela associativa (N:M) registrando períodos de empréstimo/utilização de equipamentos por obra.

---

## 📂 Estrutura de Arquivos

\\	ext
03-banco-de-dados/
├── .gitignore                                      # Ignora artefatos binários e temporários
├── README.md                                       # Documentação técnica do projeto de banco
├── modelo-conceitual.PNG                           # Diagrama Conceitual Entidade-Relacionamento
├── projeto-conceitual-fase-1-db-wendell-dorta.brM3 # Arquivo de modelagem conceitual (brModelo)
├── projeto-logico-fase-2-db-wendell-dorta.brM3     # Arquivo de modelagem lógica relacional (brModelo)
├── script-criacao-tabelas.sql                      # DDL: Criação das tabelas, chaves primárias e estrangeiras
├── script-populacao-do-banco.sql                   # DML: Povoamento com dados de teste representativos
├── script-consultas.sql                            # DQL: Consultas complexas, junções (JOINs), agrupamentos e agregações
└── dados-construtora-alfa.json                     # Carga de dados em formato JSON para interoperabilidade
\
---

## 🛠️ Tecnologias e Ferramentas

- **SGBD**: Oracle Database / SQL ANSI compatível
- **Ferramenta de Modelagem**: brModelo 3.0
- **Linguagem**: SQL (DDL, DML, DQL)
- **JSON**: Estruturação de dados para migração/APIs

---

## 🚀 Como Executar os Scripts

Execute os scripts na seguinte ordem em qualquer cliente SQL (Oracle SQL Developer, DBeaver, etc.):

1. **Criação do Esquema (DDL)**:
   \\sql
   @script-criacao-tabelas.sql
   \2. **Povoamento de Dados (DML)**:
   \\sql
   @script-populacao-do-banco.sql
   \3. **Execução de Consultas Analíticas (DQL)**:
   \\sql
   @script-consultas.sql
   \