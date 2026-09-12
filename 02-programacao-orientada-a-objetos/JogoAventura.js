// JogoAventura.js
import { Engine } from "./Basicas.js";
// Importa a classe base Engine.
import { JardimSecreto, HallEntrada, SalaLeitura, CozinhaVelha, Despensa, QuartoPrincipal, CorredorSecreto, SantuarioOculto, EstufaAbandonada } from "./SalasAventura.js";
// Importa todas as classes de salas específicas do jogo (incluindo a nova EstufaAbandonada).

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
        // Inicialização defensiva do mapaSalas.
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
        let estufa = new EstufaAbandonada(this); // Nova Sala

        // --- 2. Adição ao Mapa Global ---
        this.mapaSalas.set(jardim.nome, jardim);
        this.mapaSalas.set(hall.nome, hall);
        this.mapaSalas.set(salaLeitura.nome, salaLeitura);
        this.mapaSalas.set(cozinha.nome, cozinha);
        this.mapaSalas.set(despensa.nome, despensa);
        this.mapaSalas.set(quarto.nome, quarto);
        this.mapaSalas.set(corredor.nome, corredor);
        this.mapaSalas.set(santuario.nome, santuario);
        this.mapaSalas.set(estufa.nome, estufa); // Adiciona a nova sala

        // --- 3. Encadeamento das Salas (Definição de Portas) ---
        // Portas iniciais:
        jardim.portas.set(hall.nome, hall);
        // Jardim -> Estufa: Porta Portão_Trancado_Antigo (Liberado dinamicamente na lógica do JardimSecreto.usa())

        hall.portas.set(jardim.nome, jardim);
        hall.portas.set(salaLeitura.nome, salaLeitura);
        hall.portas.set(cozinha.nome, cozinha);

        salaLeitura.portas.set(hall.nome, hall);
        salaLeitura.portas.set(quarto.nome, quarto);
        // SalaLeitura -> Corredor: Porta dinâmica (Liberado dinamicamente na lógica do HallEntrada.usa())

        cozinha.portas.set(hall.nome, hall);
        cozinha.portas.set(despensa.nome, despensa);

        despensa.portas.set(cozinha.nome, cozinha);

        quarto.portas.set(salaLeitura.nome, salaLeitura);
        // Quarto -> Corredor: Porta dinâmica (Liberado dinamicamente na lógica do SalaLeitura.usa())

        corredor.portas.set(quarto.nome, quarto);
        corredor.portas.set(santuario.nome, santuario);
        corredor.portas.set(salaLeitura.nome, salaLeitura); // Adicionando acesso de volta pela Sala de Leitura (opcional, mas lógico)

        santuario.portas.set(corredor.nome, corredor);
        
        // Estufa -> Jardim:
        estufa.portas.set(jardim.nome, jardim); // O acesso de volta já é liberado na lógica de JardimSecreto.usa()

        // --- 4. Definição da Sala Inicial ---
        this.salaCorrente = jardim;
    }
}