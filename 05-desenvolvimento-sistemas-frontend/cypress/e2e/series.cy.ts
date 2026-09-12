describe("Series Journal E2E Tests", () => {
  beforeEach(() => {
    // Intercepta as chamadas para a nossa API REST backend
    cy.intercept("GET", "http://localhost:5000/series", {
      statusCode: 200,
      body: [
        {
          id: "1",
          title: "Breaking Bad",
          seasons: 5,
          releaseDate: "2008-01-20",
          director: "Vince Gilligan",
          producer: "AMC",
          category: "Drama",
          watchedDate: "2024-03-14",
          rating: 5,
          status: "Finalizada"
        },
        {
          id: "2",
          title: "Stranger Things",
          seasons: 4,
          releaseDate: "2016-07-15",
          director: "Duffer Brothers",
          producer: "Netflix",
          category: "Ficção Científica",
          watchedDate: "2024-01-19",
          rating: 4,
          status: "Assistindo"
        }
      ]
    }).as("getSeries");

    cy.intercept("POST", "http://localhost:5000/series", {
      statusCode: 201,
      body: {
        id: "3",
        title: "Dark",
        seasons: 3,
        releaseDate: "2017-12-01",
        director: "Baran bo Odar",
        producer: "Netflix",
        category: "Ficção Científica",
        watchedDate: "2024-04-10",
        rating: 5,
        status: "Finalizada"
      }
    }).as("createSerie");

    cy.intercept("DELETE", "http://localhost:5000/series/2", {
      statusCode: 200,
      body: {}
    }).as("deleteSerie");

    // Intercepta as chamadas para a API pública do TVmaze
    cy.intercept("GET", "https://api.tvmaze.com/search/shows?q=Breaking", {
      statusCode: 200,
      body: [
        {
          show: {
            id: 169,
            name: "Breaking Bad",
            premiered: "2008-01-20",
            genres: ["Drama"],
            network: { name: "AMC" },
            image: { medium: "https://api.tvmaze.com/images/169.jpg" }
          }
        }
      ]
    }).as("searchTvmaze");

    cy.intercept("GET", "https://api.tvmaze.com/shows/169", {
      statusCode: 200,
      body: {
        id: 169,
        name: "Breaking Bad",
        premiered: "2008-01-20",
        genres: ["Drama"],
        network: { name: "AMC" }
      }
    }).as("getTvmazeShow");

    cy.intercept("GET", "https://api.tvmaze.com/shows/169/seasons", {
      statusCode: 200,
      body: [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
      ]
    }).as("getTvmazeSeasons");

    cy.intercept("GET", "https://api.tvmaze.com/shows/169/crew", {
      statusCode: 200,
      body: [
        { type: "Creator", person: { name: "Vince Gilligan" } }
      ]
    }).as("getTvmazeCrew");
  });

  it("deve carregar a página inicial e navegar corretamente", () => {
    cy.visit("/");
    cy.contains("Bem-vindo ao Series Journal").should("be.visible");

    // Navega para a lista de séries
    cy.contains("Ver Minhas Séries").click();
    cy.url().should("include", "/series");
    cy.contains("Minhas Séries").should("be.visible");
  });

  it("deve exibir as séries na listagem e permitir fazer busca", () => {
    cy.visit("/series");
    cy.wait("@getSeries");

    // Verifica se os cartões carregaram com dados mockados
    cy.contains("Breaking Bad").should("be.visible");
    cy.contains("Stranger Things").should("be.visible");

    // Testa a barra de busca
    cy.get("input[placeholder*='Buscar por título']").type("Stranger");
    cy.contains("Breaking Bad").should("not.exist");
    cy.contains("Stranger Things").should("be.visible");
  });

  it("deve cadastrar uma nova série manualmente com sucesso", () => {
    cy.visit("/cadastrar");

    // Preenche o formulário manualmente
    cy.get("input[name='title']").type("Dark");
    cy.get("input[name='seasons']").clear().type("3");
    
    // Abre a categoria
    cy.get("div[id*='category']").click();
    cy.contains("Ficção Científica").click();

    cy.get("input[name='releaseDate']").type("2017-12-01");
    cy.get("input[name='watchedDate']").type("2024-04-10");
    cy.get("input[name='director']").type("Baran bo Odar");
    cy.get("input[name='producer']").type("Netflix");

    // Submete o formulário
    cy.contains("button", "Cadastrar Série").click();

    cy.wait("@createSerie");
    cy.url().should("include", "/series");
  });

  it("deve preencher o formulário usando o Autocomplete do TVmaze", () => {
    cy.visit("/cadastrar");

    // Digita e busca no autocomplete
    cy.get("input[name='title']").type("Breaking");
    cy.wait("@searchTvmaze");

    // Clica no item sugerido da lista do Autocomplete
    cy.contains("Breaking Bad").click();

    cy.wait("@getTvmazeShow");
    cy.wait("@getTvmazeSeasons");
    cy.wait("@getTvmazeCrew");

    // Verifica se os campos foram preenchidos dinamicamente
    cy.get("input[name='title']").should("have.value", "Breaking Bad");
    cy.get("input[name='seasons']").should("have.value", "5");
    cy.get("input[name='releaseDate']").should("have.value", "2008-01-20");
    cy.get("input[name='director']").should("have.value", "Vince Gilligan");
    cy.get("input[name='producer']").should("have.value", "AMC");
  });

  it("deve excluir uma série da lista", () => {
    cy.visit("/series");
    cy.wait("@getSeries");

    // Mock do dialog de confirmação (confirm) do navegador
    cy.on("window:confirm", () => true);

    // Clica no botão de excluir da série "Stranger Things" (id 2)
    cy.get("button").eq(2).click({ force: true }); // Abre e clica no ícone de deletar

    cy.wait("@deleteSerie");
  });
});
