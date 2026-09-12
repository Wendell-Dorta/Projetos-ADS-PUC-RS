// JogoAventura.js
import { Engine } from "./Basicas.js";
// Importa a classe base Engine.
import { JardimSecreto, HallEntrada, SalaLeitura, CozinhaVelha, Despensa, QuartoPrincipal, CorredorSecreto, SantuarioOculto } from "./SalasAventura.js";
// Importa todas as classes de salas específicas do jogo (que devem herdar de Sala).

/**
 * @class JogoAventura
 * @augments Engine
 * @description A classe principal do jogo de aventura. Herda toda a lógica de execução e
 * comando da Engine, mas implementa o método 'criaCenario' para construir o mapa.
 */
export class JogoAventura extends Engine {
    // Propriedade para armazenar todas as salas criadas, facilitando a referência no mapeamento.
    mapaSalas; 

    /**
     * @constructor
     * @description Chama o construtor da classe pai (Engine).
     * O construtor da Engine, por sua vez, chama o método 'criaCenario' desta subclasse.
     */
    constructor() {
        super(); // Inicia a Engine, que chama this.criaCenario() para montar o jogo.
    }

    /**
     * @method criaCenario
     * @description Sobrescreve o método da Engine para inicializar o mapa do jogo,
     * criando todas as salas e definindo as conexões entre elas.
     */
    criaCenario() {
        // Inicialização defensiva do mapaSalas. Isso é crucial porque o 'super()'
        // (que chama este método) é executado antes da inicialização dos campos da subclasse no JavaScript.
        if (!this.mapaSalas) {
            this.mapaSalas = new Map();
        }

        // --- 1. Criação das Instâncias das Salas ---
        let jardim = new JardimSecreto(this);
        let hall = new HallEntrada(this);
        let salaLeitura = new SalaLeitura(this);
        let cozinha = new CozinhaVelha(this);
        let despensa = new Despensa(this);
        let quarto = new QuartoPrincipal(this);
        let corredor = new CorredorSecreto(this);
        let santuario = new SantuarioOculto(this);

        // --- 2. Adição ao Mapa Global ---
        // As salas são adicionadas ao mapaSalas para fácil acesso por nome,
        // especialmente útil para lógica de portas que podem ser adicionadas dinamicamente.
        this.mapaSalas.set(jardim.nome, jardim);
        this.mapaSalas.set(hall.nome, hall);
        this.mapaSalas.set(salaLeitura.nome, salaLeitura);
        this.mapaSalas.set(cozinha.nome, cozinha);
        this.mapaSalas.set(despensa.nome, despensa);
        this.mapaSalas.set(quarto.nome, quarto);
        this.mapaSalas.set(corredor.nome, corredor);
        this.mapaSalas.set(santuario.nome, santuario);

        // --- 3. Encadeamento das Salas (Definição de Portas) ---
        // Cada sala tem sua propriedade 'portas' populada com referências a outras instâncias de Sala.

        jardim.portas.set(hall.nome, hall);

        hall.portas.set(jardim.nome, jardim);
        hall.portas.set(salaLeitura.nome, salaLeitura);
        hall.portas.set(cozinha.nome, cozinha);

        salaLeitura.portas.set(hall.nome, hall);
        salaLeitura.portas.set(quarto.nome, quarto);
        
        // NOTA: O 'Corredor_Secreto' é uma porta que deve ser adicionada dinamicamente
        // dentro da lógica de 'SalaLeitura.usa()' após o jogador realizar uma ação específica
        // (por exemplo, usar a lanterna nos livros).

        cozinha.portas.set(hall.nome, hall);
        cozinha.portas.set(despensa.nome, despensa);

        despensa.portas.set(cozinha.nome, cozinha);

        quarto.portas.set(salaLeitura.nome, salaLeitura);
        
        // NOTA: A porta para o Corredor Secreto e, em última instância, para o Santuario Oculto,
        // também deve ser revelada por alguma ação na SalaLeitura ou QuartoPrincipal.

        corredor.portas.set(quarto.nome, quarto);
        corredor.portas.set(santuario.nome, santuario);

        santuario.portas.set(corredor.nome, corredor);

        // --- 4. Definição da Sala Inicial ---
        /**
         * @property {Sala} salaCorrente Define o ponto de partida do jogador.
         */
        this.salaCorrente = jardim;
    }
}