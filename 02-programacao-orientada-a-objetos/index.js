import { JogoAventura } from "./JogoAventura.js";
// Importa a classe principal do jogo, 'JogoAventura', que deve herdar de Engine.
// Presume-se que 'JogoAventura' contém a lógica específica do cenário (o que estava no método criaCenario()).

/**
 * @file index.js (ou main.js)
 * @description Ponto de inicialização do jogo.
 */

// Cria uma nova instância da classe que representa o jogo completo (cenário + lógica).
let jogo = new JogoAventura();

// Chama o método 'joga()' da instância, que inicia o loop principal de interações
// com o jogador (leitura de comandos, descrição da sala, etc.).
jogo.joga();