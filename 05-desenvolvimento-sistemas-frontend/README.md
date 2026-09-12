# Series Journal - Fase 1

**Aluno:** Wendell de Souza Dorta

**Disciplina:** Desenvolvimento de Sistemas Frontend

Este é um projeto de gerenciamento de séries assistidas desenvolvido com React (Next.js). A aplicação atende a todos os requisitos da Fase 1, realizando operações dinâmicas estáticas de CRUD utilizando o `localStorage` do navegador.

## 🛠️ Tecnologias Utilizadas
- **Framework:** Next.js (App Router)
- **UI:** Material-UI (MUI) & Tailwind CSS
- **Formulários & Validação:** React Hook Form + Zod
- **Feedbacks:** React Toastify
- **Qualidade de Código:** ESLint & Prettier

## ⚙️ Como executar o projeto

1. Extraia o arquivo `.zip` e abra a pasta do projeto em seu terminal.
2. Instale as dependências (Node.js é necessário):
```bash
npm install
```
3. Execute o projeto localmente:
```bash
npm run dev
```
4. O projeto estará rodando em [http://localhost:3000](http://localhost:3000).

## 🧪 Testes

A estrutura para a execução de testes unitários (com **Jest**) e testes de integração/E2E (com **Cypress**) já está pré-configurada no projeto (arquivos `jest.config.js`, `cypress.config.ts`, etc.). No entanto, os casos de testes ainda não foram implementados nesta **Fase 1**.

## 🧩 Descrição dos Componentes Principais

- **NavBar:** Componente de layout localizado no topo de todas as páginas. Responsável por abrigar a logo da aplicação e os botões de navegação (Home, Sobre, Cadastrar e Lista). Utiliza o `usePathname` para destacar dinamicamente em qual rota o usuário está no momento.
- **SerieList:** Componente responsável por renderizar os *Cards* contendo as informações das séries assistidas e uma barra de busca dinâmica. Ele recebe a lista de séries via `props` e mapeia gerando o layout visual. Também emite o evento de exclusão e possui atalho para a edição de cada item.
- **SerieForm:** Componente de formulário altamente interativo. Utiliza o `zod` para validação em tempo real e o `react-hook-form` para controle de estado dos inputs sem perder performance. É um componente reutilizável, servindo tanto para criar novas séries quanto para editar as já existentes.
- **useSeries (Hook Customizado):** Controller responsável por toda a lógica de negócios e abstração do CRUD. É ele que busca, salva, edita e deleta as séries utilizando a Web Storage API (`localStorage`) para manter o estado persistente entre as atualizações de página.

## 📸 Imagens do Projeto

*(As imagens abaixo demonstram o funcionamento da interface)*

![Página Home](./project-images/print-home.png)

![Formulário de Cadastro](./project-images/print-cadastro.png)

![Lista de Séries sem Busca](./project-images/print-lista-1.png)

![Lista de Séries com Busca](./project-images/print-lista-2.png)

![Formulário de Edição](./project-images/print-edit.png)
