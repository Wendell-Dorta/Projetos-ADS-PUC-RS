import { validate } from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({ sigint: true });

// Importa a função 'validate' para validação de contratos (tipos de dados)
// Importa 'prompt-sync' para permitir a entrada de dados síncrona do usuário no console
// 'prompt' é a função configurada para obter entrada do usuário.

// ---------------------------------------------
/**
 * @class Ferramenta
 * @description Representa um item que pode ser usado em objetos do jogo,
 * podendo ter usos limitados ou ilimitados.
 *
 * Exemplo: Uma 'chave' (uso ilimitado), ou um 'palito de fósforo' (uso limitado).
 */
export class Ferramenta {
    #nome; // Nome da ferramenta (privado)
    #usos; // Número de usos restantes. -1 significa usos ilimitados (privado)

    /**
     * @constructor
     * @param {string} nome O nome da ferramenta.
     * @param {number} [usos=-1] O número de vezes que a ferramenta pode ser usada. -1 para ilimitado.
     */
    constructor(nome, usos = -1) {
        validate(nome, "String");
        validate(usos, "Number");
        this.#nome = nome;
        this.#usos = usos;
    }

    /**
     * @property {string} nome Retorna o nome da ferramenta. (Getter)
     */
    get nome() {
        return this.#nome;
    }

    /**
     * @property {number} usos Retorna o número de usos restantes da ferramenta. (Getter)
     */
    get usos() {
        return this.#usos;
    }

    /**
     * @property {number} usos Define o número de usos restantes da ferramenta. (Setter)
     */
    set usos(valor) {
        validate(valor, "Number");
        this.#usos = valor;
    }

    /**
     * @method usar
     * @description Tenta usar a ferramenta. Decrementa o número de usos se for limitado (> 0).
     * @returns {boolean} Retorna true se a ferramenta pôde ser usada (uso ilimitado ou usos > 0), false caso contrário (usos esgotados).
     */
    usar() {
        if (this.#usos > 0) {
            this.#usos--;
            return true;
        } else if (this.#usos === -1) { // Uso ilimitado
            return true;
        }
        return false;
    }
}

/**
 * @class Mochila
 * @description Representa o inventário do jogador, onde as ferramentas são armazenadas.
 */
export class Mochila {
    #ferramentas; // Array de objetos Ferramenta guardados na mochila (privado)

    /**
     * @constructor
     * @description Inicializa a mochila com uma lista de ferramentas vazia.
     */
    constructor() {
        this.#ferramentas = [];
    }

    /**
     * @method guarda
     * @description Adiciona uma Ferramenta à mochila.
     * @param {Ferramenta} ferramenta O objeto Ferramenta a ser guardado.
     */
    guarda(ferramenta) {
        validate(ferramenta, Ferramenta);
        this.#ferramentas.push(ferramenta);
    }

    /**
     * @method pega
     * @description Busca uma ferramenta pelo nome na mochila.
     * @param {string} nomeFerramenta O nome da ferramenta a ser buscada.
     * @returns {Ferramenta | null} O objeto Ferramenta se encontrado, ou null se não.
     */
    pega(nomeFerramenta) {
        validate(arguments, ["String"]);
        let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
        // Garante que uma ferramenta com 0 usos não seja "pega" (embora ainda esteja no array)
        if (ferramenta && ferramenta.usos === 0) {
            return null;
        }
        return ferramenta;
    }

    /**
     * @method tem
     * @description Verifica se uma ferramenta com o nome especificado existe na mochila.
     * @param {string} nomeFerramenta O nome da ferramenta.
     * @returns {boolean} Retorna true se a ferramenta estiver na mochila, false caso contrário.
     */
    tem(nomeFerramenta) {
        validate(arguments, ["String"]);
        return this.#ferramentas.some(f => f.nome === nomeFerramenta);
    }

    /**
     * @method remove
     * @description Remove uma ferramenta da mochila pelo nome.
     * **Nota:** Este método foi sugerido no comentário da classe Sala, mas não está no código original,
     * então foi adicionado aqui para completar a lógica.
     * @param {string} nomeFerramenta O nome da ferramenta a ser removida.
     */
    remove(nomeFerramenta) {
        this.#ferramentas = this.#ferramentas.filter(f => f.nome !== nomeFerramenta);
    }

    /**
     * @method inventario
     * @description Lista os nomes de todas as ferramentas disponíveis na mochila, separadas por vírgula.
     * @returns {string} Uma string com os nomes das ferramentas.
     */
    inventario() {
        return this.#ferramentas.map(obj => obj.nome).join(", ");
    }
}

// ---------------------------------------------
/**
 * @class Objeto
 * @description Representa um objeto interativo dentro de uma Sala.
 * Possui descrições diferentes dependendo se a ação já foi realizada ou não.
 */
export class Objeto {
    #nome; // Nome do objeto (privado)
    _descricaoAntesAcao; // Descrição antes de uma ação ser bem-sucedida (protegida por convenção)
    _descricaoDepoisAcao; // Descrição depois de uma ação ser bem-sucedida (protegida por convenção)
    #acaoOk; // Estado que indica se a ação principal do objeto foi realizada (privado)

    /**
     * @constructor
     * @param {string} nome O nome do objeto.
     * @param {string} descricaoAntesAcao A descrição do objeto antes da ação.
     * @param {string} descricaoDepoisAcao A descrição do objeto depois da ação.
     */
    constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
        validate(arguments, ["String", "String", "String"]);
        this.#nome = nome;
        this._descricaoAntesAcao = descricaoAntesAcao; // Atribuição para a propriedade protegida
        this._descricaoDepoisAcao = descricaoDepoisAcao; // Atribuição para a propriedade protegida
        this.#acaoOk = false;
    }

    /**
     * @property {string} nome Retorna o nome do objeto.
     */
    get nome() {
        return this.#nome;
    }

    /**
     * @property {boolean} acaoOk Retorna o estado de ação realizada (true/false).
     */
    get acaoOk() {
        return this.#acaoOk;
    }

    /**
     * @property {boolean} acaoOk Define o estado de ação realizada.
     */
    set acaoOk(acaoOk) {
        validate(acaoOk, "Boolean");
        this.#acaoOk = acaoOk;
    }

    /**
     * @property {string} descricao Retorna a descrição do objeto.
     * Escolhe entre `_descricaoAntesAcao` e `_descricaoDepoisAcao` baseado no estado `acaoOk`.
     */
    get descricao() {
        if (!this.acaoOk) {
            return this._descricaoAntesAcao;
        } else {
            return this._descricaoDepoisAcao;
        }
    }

    /**
     * @method usar
     * @description Método para tentar usar uma ferramenta no objeto. **Deve ser sobrescrito**
     * nas subclasses para implementar a lógica específica de interação.
     * @param {Ferramenta} ferramenta O objeto Ferramenta sendo usado.
     * @returns {boolean} Retorna false por padrão (ação sem sucesso).
     */
    usar(ferramenta) { // Método para ser sobrescrito
        validate(ferramenta, Ferramenta);
        return false;
    }
}
// ---------------------------------------------
/**
 * @class Sala
 * @description Representa um local no jogo (um cômodo, área, etc.).
 * Contém objetos, ferramentas e portas que levam a outras salas.
 */
export class Sala {
    #nome; // Nome da sala (privado)
    #objetos; // Map de objetos interativos na sala (nome -> Objeto) (privado)
    #ferramentas; // Map de ferramentas disponíveis para pegar na sala (nome -> Ferramenta) (privado)
    #portas; // Map de portas para outras salas (nome da porta/direção -> Sala) (privado)
    #engine; // Referência à Engine do jogo (privado)

    /**
     * @constructor
     * @param {string} nome O nome da sala.
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(nome, engine) {
        // A validação para 'Engine' pressupõe que a classe Engine será definida antes ou no mesmo arquivo
        validate(arguments, ["String", Engine]); 
        this.#nome = nome;
        this.#objetos = new Map();
        this.#ferramentas = new Map();
        this.#portas = new Map();
        this.#engine = engine;
    }

    // Getters
    get nome() { return this.#nome; }
    get objetos() { return this.#objetos; }
    get ferramentas() { return this.#ferramentas; }
    get portas() { return this.#portas; }
    get engine() { return this.#engine; }

    /**
     * @method objetosDisponiveis
     * @description Retorna uma lista formatada dos nomes e descrições dos objetos na sala.
     * @returns {string[]} Um array de strings no formato "nome:descricao".
     */
    objetosDisponiveis() {
        let arrObjs = [...this.#objetos.values()];
        return arrObjs.map(obj => obj.nome + ":" + obj.descricao);
    }

    /**
     * @method ferramentasDisponiveis
     * @description Retorna uma lista dos nomes das ferramentas que podem ser pegas na sala.
     * @returns {string[]} Um array de strings contendo os nomes das ferramentas.
     */
    ferramentasDisponiveis() {
        let arrFer = [...this.#ferramentas.values()];
        return arrFer.map(f => f.nome);
    }

    /**
     * @method portasDisponiveis
     * @description Retorna uma lista dos nomes das salas que são acessíveis pelas portas desta sala.
     * @returns {string[]} Um array de strings contendo os nomes das salas de destino.
     */
    portasDisponiveis() {
        let arrPortas = [...this.#portas.values()];
        return arrPortas.map(sala => sala.nome);
    }

    /**
     * @method pega
     * @description Tenta pegar uma ferramenta da sala e a guarda na mochila do jogador.
     * Remove a ferramenta da sala se for bem-sucedido.
     * @param {string} nomeFerramenta O nome da ferramenta a ser pega.
     * @returns {boolean} Retorna true se a ferramenta foi pega, false caso contrário (não encontrada ou usos esgotados).
     */
    pega(nomeFerramenta) {
        validate(nomeFerramenta, "String");
        let ferramenta = this.#ferramentas.get(nomeFerramenta);
        if (ferramenta != null) {
            // Se a ferramenta tem usos limitados e já foi usada completamente, não pode ser pega
            if (ferramenta.usos === 0) {
                return false;
            }
            this.#engine.mochila.guarda(ferramenta);
            this.#ferramentas.delete(nomeFerramenta);
            return true;
        } else {
            return false;
        }
    }

    /**
     * @method sai
     * @description Tenta sair por uma "porta" (na verdade o nome da sala de destino).
     * @param {string} porta O nome da sala de destino (chave no map de portas).
     * @returns {Sala | null} Retorna o objeto Sala de destino, ou null se a porta não existir.
     */
    sai(porta) {
        validate(porta, "String");
        return this.#portas.get(porta);
    }

    /**
     * @method textoDescricao
     * @description Gera um texto completo descrevendo a sala atual (nome, objetos, ferramentas, portas).
     * @returns {string} O texto de descrição da sala.
     */
    textoDescricao() {
        let descricao = "Você está no **" + this.nome + "**\n";
        if (this.objetos.size == 0) {
            descricao += "Não há objetos na sala\n";
        } else {
            descricao += "Objetos: " + this.objetosDisponiveis().join(", ") + "\n";
        }
        if (this.ferramentas.size == 0) {
            descricao += "Não há ferramentas na sala\n";
        } else {
            descricao += "Ferramentas: " + this.ferramentasDisponiveis() + "\n";
        }
        descricao += "Portas: " + this.portasDisponiveis() + "\n";
        return descricao;
    }

    /**
     * @method usa
     * @description Tenta usar uma ferramenta da mochila em um objeto da sala.
     * Lida com a lógica de uso limitado da ferramenta e propagação de exceções de jogo.
     * @param {string} ferramentaNome O nome da ferramenta na mochila.
     * @param {string} objetoNome O nome do objeto na sala.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida, false caso contrário.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let ferramenta = this.#engine.mochila.pega(ferramentaNome);
        let objeto = this.#objetos.get(objetoNome);

        if (!ferramenta || !objeto) {
            console.log(`Não é possível usar '${ferramentaNome}' sobre '${objetoNome}'. Ferramenta ou objeto não disponível ou não está na mochila.`);
            return false;
        }

        // Tenta usar a ferramenta (decrementa usos se for limitado e > 0)
        if (ferramenta.usos !== -1 && !ferramenta.usar()) {
            console.log(`A ferramenta '${ferramentaNome}' não pode mais ser usada.`);
            this.#engine.mochila.remove(ferramentaNome); // Remove a ferramenta esgotada da mochila
            return false;
        }

        let usou = false;
        try {
            // Tenta usar a ferramenta no objeto (lógica específica do Objeto)
            usou = objeto.usar(ferramenta);
        } catch (error) {
            // Propaga exceções de derrota/fim de jogo
            throw error;
        }

        if (usou) {
            if (ferramenta.usos !== -1 && ferramenta.usos === 0) {
                // Se a ferramenta foi consumida após o uso bem-sucedido, remove-a da mochila.
                this.#engine.mochila.remove(ferramentaNome); 
                console.log(`A ferramenta '${ferramenta.nome}' foi totalmente consumida.`);
            }
        }
        return usou;
    }
}
// ---------------------------------------------
/**
 * @class Engine
 * @description A classe principal de controle do jogo (Game Engine).
 * Gerencia o estado do jogo (mochila, sala atual) e o loop principal.
 */
export class Engine {
    #mochila; // A Mochila do jogador (privado)
    #salaCorrente; // A Sala onde o jogador está atualmente (privado)
    #fim; // Flag que indica se o jogo deve terminar (privado)

    /**
     * @constructor
     * @description Inicializa a Engine, cria a Mochila, define a sala inicial como null e inicia o cenário.
     */
    constructor() {
        this.#mochila = new Mochila();
        this.#salaCorrente = null;
        this.#fim = false;
        this.criaCenario(); // Método abstrato que deve ser implementado pela subclasse
    }

    // Getters e Setters
    get mochila() { return this.#mochila; }
    get salaCorrente() { return this.#salaCorrente; }
    get fim() { return this.#fim; }

    set salaCorrente(sala) {
        validate(sala, Sala);
        this.#salaCorrente = sala;
    }

    /**
     * @method indicaFimDeJogo
     * @description Define a flag de fim de jogo como true.
     */
    indicaFimDeJogo() {
        this.#fim = true;
    }

    /**
     * @method criaCenario
     * @description Método abstrato onde a lógica de criação das salas, objetos e ferramentas do jogo deve ser implementada.
     * Por convenção, esta classe deve ser herdada e o método sobrescrito.
     */
    criaCenario() { 
        // Lógica de criação do cenário (salas, objetos, etc.) deve ser aqui
    }

    /**
     * @method joga
     * @description O loop principal do jogo. Repete até que o jogo termine (`#fim` seja true).
     * Lida com a entrada do usuário e o processamento dos comandos.
     */
    joga() {
        let novaSala = null;
        let acao = "";
        let tokens = null;
        while (!this.#fim) {
            console.log("-------------------------");
            // Exibe a descrição da sala atual
            console.log(this.salaCorrente.textoDescricao()); 
            // Pede um comando ao usuário
            acao = prompt("O que voce deseja fazer? "); 
            tokens = acao.split(" ");
            
            // Lógica de processamento dos comandos
            switch (tokens[0].toLowerCase()) {
                case "fim":
                    this.#fim = true;
                    break;
                case "pega":
                    if (this.salaCorrente.pega(tokens[1])) {
                        console.log(`Ok! '${tokens[1]}' guardado!`);
                    } else {
                        console.log(`Ferramenta '${tokens[1]}' não encontrada ou não pode ser pega.`);
                    }
                    break;
                case "inventario":
                    console.log("Ferramentas disponiveis na mochila: " + this.#mochila.inventario());
                    break;
                case "usa":
                    try {
                        // Tenta usar a ferramenta no objeto
                        if (this.salaCorrente.usa(tokens[1], tokens[2])) {
                            console.log("Ação realizada com sucesso!");
                            if (this.#fim == true) { // Verifica se a ação levou à vitória
                                console.log("Parabéns, você venceu o jogo!");
                            }
                        } else {
                            console.log(`Não é possível usar '${tokens[1]}' sobre '${tokens[2]}' nesta sala ou a ferramenta/objeto não está disponível.`);
                        }
                    } catch (error) {
                        // Lida com exceções de fim de jogo (derrota)
                        if (error.message.includes("Fim de Jogo:")) {
                            console.log(error.message); 
                            this.indicaFimDeJogo(); // Garante que o loop será encerrado
                        } else {
                            console.error("Um erro inesperado ocorreu:", error);
                            this.indicaFimDeJogo(); // Encerra o jogo em caso de erro grave
                        }
                    }
                    break;
                case "sai":
                    // Tenta se mover para outra sala
                    novaSala = this.salaCorrente.sai(tokens[1]);
                    if (novaSala == null) {
                        console.log("Sala desconhecida ...");
                    } else {
                        this.#salaCorrente = novaSala; // Muda a sala corrente
                    }
                    break;
                default:
                    console.log("Comando desconhecido: " + tokens[0]);
                    break;
            }
        }
        console.log("Jogo encerrado!");
    }
}