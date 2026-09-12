import { validate } from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({ sigint: true });

// ----------------------------------------------------------------------
// CLASSES BASE DO FRAMEWORK DO JOGO DE AVENTURA
// ----------------------------------------------------------------------

/**
 * @class Ferramenta
 * @description Representa um item que pode ser coletado pelo jogador e usado em objetos do jogo.
 * Pode ter um número limitado ou ilimitado de usos.
 */
export class Ferramenta {
    #nome; // Nome único da ferramenta (privado)
    #usos; // Número de usos restantes. -1 significa usos ilimitados (privado)

    /**
     * @constructor
     * @param {string} nome O nome da ferramenta (ex: "martelo", "chave_pequena").
     * @param {number} [usos=-1] O número de vezes que a ferramenta pode ser usada.
     *                          -1 indica usos ilimitados.
     */
    constructor(nome, usos = -1) {
        validate(nome, "String");
        validate(usos, "Number");
        this.#nome = nome;
        this.#usos = usos;
    }

    /**
     * @property {string} nome Retorna o nome da ferramenta. (Usado como nome de comando)
     */
    get nome() {
        return this.#nome;
    }

    /**
     * @property {string} infoUsos
     * @description Retorna uma string com a informação de usos restantes/ilimitados/esgotada.
     */
    get infoUsos() {
        if (this.#usos > 0) {
            return `(${this.#usos} usos restantes)`;
        } else if (this.#usos === -1) {
            return `(usos ilimitados)`;
        }
        return `(esgotada)`; // 0 usos
    }

    /**
     * @property {number} usos Retorna o número de usos restantes da ferramenta.
     */
    get usos() {
        return this.#usos;
    }

    /**
     * @property {number} usos Define o número de usos restantes da ferramenta.
     * @param {number} valor O novo valor para os usos.
     */
    set usos(valor) {
        validate(valor, "Number");
        this.#usos = valor;
    }

    /**
     * @method usar
     * @description Tenta usar a ferramenta. Se a ferramenta tem usos limitados (>0),
     *              decrementa o contador de usos.
     * @returns {boolean} Retorna `true` se a ferramenta pôde ser usada (usos ilimitados ou usos > 0 antes do uso),
     *                    `false` caso contrário (usos esgotados).
     */
    usar() {
        if (this.#usos > 0) {
            this.#usos--;
            return true;
        } else if (this.#usos === -1) { // Usos ilimitados
            return true;
        }
        return false; // Sem usos restantes
    }
}

/**
 * @class Mochila
 * @description Representa o inventário do jogador, onde as ferramentas coletadas são armazenadas.
 *              Possui uma capacidade máxima predefinida de ferramentas.
 */
export class Mochila {
    #ferramentas;      // Array de objetos Ferramenta guardados na mochila (privado)
    #capacidadeMaxima; // Capacidade máxima de ferramentas que a mochila pode conter (privado)

    /**
     * @constructor
     * @param {number} [capacidadeMaxima=3] A quantidade máxima de ferramentas que a mochila pode carregar.
     */
    constructor(capacidadeMaxima = 3) {
        validate(capacidadeMaxima, "Number");
        this.#ferramentas = [];
        this.#capacidadeMaxima = capacidadeMaxima;
    }

    /**
     * @method guarda
     * @description Adiciona uma Ferramenta à mochila, se houver espaço.
     * @param {Ferramenta} ferramenta O objeto Ferramenta a ser guardado.
     * @returns {boolean} Retorna `true` se a ferramenta foi guardada com sucesso, `false` se a mochila está cheia.
     */
    guarda(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (this.#ferramentas.length >= this.#capacidadeMaxima) {
            console.log("Sua mochila está cheia! Não é possível guardar mais ferramentas.");
            return false;
        }
        this.#ferramentas.push(ferramenta);
        return true;
    }

    /**
     * @method pega
     * @description Busca uma ferramenta pelo nome na mochila.
     *              Importante: A ferramenta ainda está na mochila, mas o método retorna null
     *              se ela estiver esgotada para indicar que não pode ser usada no momento.
     * @param {string} nomeFerramenta O nome da ferramenta a ser buscada.
     * @returns {Ferramenta | null} O objeto Ferramenta se encontrado e com usos restantes,
     *                               ou `null` se não encontrada ou com usos esgotados.
     */
    pega(nomeFerramenta) {
        validate(arguments, ["String"]);
        let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
        // Retorna null se esgotada para indicar que não está disponível para uso
        if (ferramenta && ferramenta.usos === 0) {
            return null;
        }
        return ferramenta;
    }

    /**
     * @method tem
     * @description Verifica se uma ferramenta com o nome especificado existe na mochila e tem usos restantes.
     * @param {string} nomeFerramenta O nome da ferramenta.
     * @returns {boolean} Retorna `true` se a ferramenta estiver na mochila e pode ser usada, `false` caso contrário.
     */
    tem(nomeFerramenta) {
        validate(arguments, ["String"]);
        return this.#ferramentas.some(f => f.nome === nomeFerramenta && f.usos !== 0);
    }

    /**
     * @method remove
     * @description Remove uma ferramenta da mochila pelo nome.
     *              Usado com o comando 'descartar'.
     * @param {string} nomeFerramenta O nome da ferramenta a ser removida.
     * @returns {boolean} Retorna `true` se a ferramenta foi encontrada e removida, `false` caso contrário.
     */
    remove(nomeFerramenta) {
        const initialLength = this.#ferramentas.length;
        this.#ferramentas = this.#ferramentas.filter(f => f.nome !== nomeFerramenta);
        return this.#ferramentas.length < initialLength;
    }

    /**
     * @method inventario
     * @description Gera uma string formatada que lista todas as ferramentas na mochila,
     *              incluindo seus usos restantes (ou ilimitados/esgotada) e a capacidade atual/máxima da mochila.
     *              Itens esgotados SÃO exibidos, com sua condição.
     * @returns {string} Uma string amigável com o conteúdo da mochila.
     */
    inventario() {
        let inventarioStr = `Sua mochila (${this.#ferramentas.length}/${this.#capacidadeMaxima}):\n`;
        
        if (this.#ferramentas.length === 0) {
            inventarioStr += "Está vazia.";
        } else {
            // Exibe TODOS os itens, incluindo os esgotados, com a informação de uso.
            const itensFormatados = this.#ferramentas.map(ferramenta => 
                `* ${ferramenta.nome} ${ferramenta.infoUsos}` // Usa nome "cru" + info de uso
            );
            inventarioStr += itensFormatados.join("\n");
        }
        return inventarioStr;
    }
}

// ----------------------------------------------------------------------
/**
 * @class Objeto
 * @description Representa um objeto interativo dentro de uma Sala.
 */
export class Objeto {
    #nome;
    _descricaoAntesAcao;  // Protegida por convenção
    _descricaoDepoisAcao; // Protegida por convenção
    #acaoOk;

    /**
     * @constructor
     * @param {string} nome O nome do objeto.
     * @param {string} descricaoAntesAcao A descrição do objeto antes da ação.
     * @param {string} descricaoDepoisAcao A descrição do objeto depois da ação.
     */
    constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
        validate(arguments, ["String", "String", "String"]);
        this.#nome = nome;
        this._descricaoAntesAcao = descricaoAntesAcao;
        this._descricaoDepoisAcao = descricaoDepoisAcao;
        this.#acaoOk = false;
    }

    /**
     * @property {string} nome Retorna o nome do objeto.
     */
    get nome() {
        return this.#nome;
    }

    /**
     * @property {boolean} acaoOk Retorna o estado que indica se a ação principal do objeto foi realizada.
     */
    get acaoOk() {
        return this.#acaoOk;
    }

    /**
     * @property {boolean} acaoOk Define o estado de ação realizada para o objeto.
     * @param {boolean} acaoOk O novo estado.
     */
    set acaoOk(acaoOk) {
        validate(acaoOk, "Boolean");
        this.#acaoOk = acaoOk;
    }

    /**
     * @property {string} descricao
     * @description Retorna a descrição atual do objeto.
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
     * @description Método para tentar usar uma ferramenta específica neste objeto.
     *              **Deve ser sobrescrito** nas subclasses.
     * @param {Ferramenta} ferramenta O objeto Ferramenta sendo usado.
     * @returns {boolean} Retorna `false` por padrão.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        return false;
    }
}

// ----------------------------------------------------------------------
/**
 * @class Sala
 * @description Representa um local físico no jogo.
 */
export class Sala {
    #nome;
    #objetos;
    #ferramentas;
    #portas;
    #engine;

    /**
     * @constructor
     * @param {string} nome O nome da sala.
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(nome, engine) {
        validate(arguments, ["String", Engine]); 
        this.#nome = nome;
        this.#objetos = new Map();
        this.#ferramentas = new Map();
        this.#portas = new Map();
        this.#engine = engine; 
    }

    // Getters para acesso controlado às propriedades privadas
    get nome() { return this.#nome; }
    get objetos() { return this.#objetos; }
    get ferramentas() { return this.#ferramentas; }
    get portas() { return this.#portas; }
    get engine() { return this.#engine; }

    /**
     * @method objetosDisponiveis
     * @description Retorna uma lista formatada dos nomes "crus" e descrições dos objetos na sala.
     * @returns {string[]} Um array de strings, formatado para exibição.
     */
    objetosDisponiveis() {
        let arrObjs = [...this.#objetos.values()];
        return arrObjs.map(obj => `* ${obj.nome}: ${obj.descricao}`);
    }

    /**
     * @method ferramentasParaExibicao
     * @description Retorna uma lista formatada das ferramentas disponíveis para serem pegas na sala,
     *              incluindo seus usos. Itens esgotados NÃO SÃO exibidos aqui.
     * @returns {string[]} Um array de strings formatado, pronto para exibição.
     */
    ferramentasParaExibicao() {
        let arrFer = [...this.#ferramentas.values()];
        // Filtra ferramentas que já não têm usos e mapeia para o formato de inventário (nome + info usos)
        return arrFer
            .filter(f => f.usos !== 0) 
            .map(f => `* ${f.nome} ${f.infoUsos}`);
    }

    /**
     * @method portasDisponiveis
     * @description Retorna uma lista dos nomes "crus" das portas disponíveis para navegação.
     * @returns {string[]} Um array de strings com os nomes das portas.
     */
    portasDisponiveis() {
        let arrPortas = [...this.#portas.keys()];
        return arrPortas.map(chave => chave.toLowerCase());
    }

    /**
     * @method pega
     * @description Tenta pegar uma ferramenta da sala e guardá-la na mochila do jogador.
     *              Se a ferramenta existir, tiver usos e a mochila não estiver cheia, a ferramenta é transferida.
     * @param {string} nomeFerramenta O nome "cru" da ferramenta a ser pega.
     * @returns {boolean} Retorna `true` se a ferramenta foi pega com sucesso, `false` caso contrário.
     */
    pega(nomeFerramenta) {
        validate(nomeFerramenta, "String");
        let ferramenta = this.#ferramentas.get(nomeFerramenta);
        
        if (ferramenta != null) {
            if (ferramenta.usos === 0) {
                console.log(`A ferramenta '${nomeFerramenta}' está esgotada e não pode ser pega.`);
                return false;
            }
            
            if (this.#engine.mochila.guarda(ferramenta)) {
                this.#ferramentas.delete(nomeFerramenta); // Remove a ferramenta da sala se guardada com sucesso
                return true; // Sucesso ao pegar e guardar
            } else {
                // Mochila estava cheia, a mensagem de "mochila cheia" já foi exibida por Mochila.guarda()
                return false; // Falha ao guardar na mochila
            }
        } else {
            console.log(`A ferramenta '${nomeFerramenta}' não está visível aqui.`);
            return false; // Ferramenta não encontrada na sala
        }
    }

    /**
     * @method sai
     * @description Tenta mudar o jogador para outra sala.
     * @param {string} porta O nome "cru" da sala de destino conforme digitado pelo usuário.
     * @returns {Sala | null} Retorna o objeto `Sala` de destino se encontrada, ou `null` se a porta não existir.
     */
    sai(porta) {
        validate(porta, "String");
        // Compara a entrada do usuário (já em minúsculas) com as chaves do mapa (que foram guardadas em minúsculas)
        return this.#portas.get(porta);
    }

    /**
     * @method textoDescricao
     * @description Gera um texto completo e formatado descrevendo a sala atual.
     * @returns {string} O texto de descrição formatado da sala.
     */
    textoDescricao() {
        let descricao = "\n================================================\n";
        descricao += ` LOCAL: **${this.nome.replace(/_/g, " ")}**\n`; // Nome da sala formatado para exibição
        descricao += "================================================\n\n";
        
        // Seção de Objetos Interativos
        let objetosDisponiveis = this.objetosDisponiveis();
        if (objetosDisponiveis.length === 0) {
            descricao += "OBJETOS INTERATIVOS: Não há objetos visíveis aqui.\n\n";
        } else {
            descricao += "OBJETOS INTERATIVOS:\n" + objetosDisponiveis.join("\n") + "\n\n";
        }

        // Seção de Ferramentas para Pegar
        let ferramentasParaPegar = this.ferramentasParaExibicao();
        if (ferramentasParaPegar.length === 0) {
            descricao += "FERRAMENTAS PARA PEGAR: Não há ferramentas visíveis aqui.\n\n";
        } else {
            descricao += "FERRAMENTAS PARA PEGAR:\n" + ferramentasParaPegar.join("\n") + "\n\n";
        }

        // Seção de Portas Disponíveis
        let portasDisponiveis = this.portasDisponiveis();
        if (portasDisponiveis.length === 0) {
            descricao += "PORTAS DISPONÍVEIS: Nenhuma saída no momento.\n";
        } else {
            descricao += "PORTAS DISPONÍVEIS (Comando: sai [nome_da_porta]):\n" + 
                         portasDisponiveis.map(p => `* ${p}`).join("\n") + "\n"; // Exibe nomes "crus" para o comando
        }
        
        return descricao;
    }

    /**
     * @method usa
     * @description Tenta usar uma ferramenta da mochila em um objeto da sala.
     *              A ferramenta é consumida (se limitada) antes de ser passada ao objeto.
     * @param {string} ferramentaNome O nome "cru" da ferramenta na mochila.
     * @param {string} objetoNome O nome "cru" do objeto na sala.
     * @returns {boolean} Retorna `true` se a ação foi bem-sucedida, `false` caso contrário.
     * @throws {Error} Propaga exceções de "Fim de Jogo".
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        // Pega as instâncias usando os nomes "crus"
        const ferramentaNaMochila = this.#engine.mochila.pega(ferramentaNome);
        const objetoNaSala = this.#objetos.get(objetoNome);

        if (!ferramentaNaMochila || !objetoNaSala) {
            // A mensagem de erro agora usa os nomes crus para ser consistente com o input esperado.
            console.log(`Erro: Verifique se a ferramenta '${ferramentaNome}' está na sua mochila e o objeto '${objetoNome}' está na sala.`);
            return false;
        }

        // Tenta usar a ferramenta (decrementa usos se for limitado e > 0).
        // Se usar() retornar false, significa que os usos acabaram.
        if (ferramentaNaMochila.usos !== -1 && !ferramentaNaMochila.usar()) {
            console.log(`A ferramenta '${ferramentaNaMochila.nome}' não pode mais ser usada.`);
            // A remoção daqui foi ajustada: a ferramenta com 0 usos NÃO é removida automaticamente,
            // mas um comando 'descartar' pode ser usado.
            return false;
        }
        
        let usou = false;
        try {
            usou = objetoNaSala.usar(ferramentaNaMochila);
        } catch (error) {
            throw error; 
        }

        if (usou) {
            // Se a ferramenta foi consumida após um uso bem-sucedido, mas NÃO é removida automaticamente aqui.
            if (ferramentaNaMochila.usos !== -1 && ferramentaNaMochila.usos === 0) {
                console.log(`A ferramenta '${ferramentaNaMochila.nome}' foi totalmente consumida. Considere descartá-la para liberar espaço.`);
            }
        }
        return usou;
    }
}

// ----------------------------------------------------------------------
/**
 * @class Engine
 * @description A classe principal de controle do jogo.
 */
export class Engine {
    #mochila;
    #salaCorrente;
    #fim;

    constructor() {
        this.#mochila = new Mochila(); 
        this.#salaCorrente = null;
        this.#fim = false;
        this.criaCenario();
    }

    get mochila() { return this.#mochila; }
    get salaCorrente() { return this.#salaCorrente; }
    get fim() { return this.#fim; }

    set salaCorrente(sala) {
        validate(sala, Sala);
        this.#salaCorrente = sala;
    }

    indicaFimDeJogo() {
        this.#fim = true;
    }

    criaCenario() { }

    /**
     * @method joga
     * @description Implementa o loop principal do jogo, incluindo o novo comando 'descartar'.
     */
    joga() {
        let novaSala = null;
        let acao = "";
        let tokens = null; 

        while (!this.#fim) { 
            console.log(this.salaCorrente.textoDescricao()); 
            
            // Novo prompt para incluir o comando 'descartar'
            acao = prompt("Comando (pega [ferramenta] | usa [ferramenta] [objeto] | sai [porta] | inventario | descartar [ferramenta] | fim): "); 
            
            tokens = acao.toLowerCase().split(" ");
            
            switch (tokens[0]) {
                case "fim":
                    this.#fim = true;
                    break;
                
                case "pega":
                    if (tokens.length < 2) { 
                        console.log("Comando incompleto. Use: pega [nome_da_ferramenta]"); 
                        break; 
                    }
                    if (this.salaCorrente.pega(tokens[1])) { 
                        console.log(`Ok! A ferramenta '${tokens[1]}' foi guardada na mochila.`);
                    }
                    break;
                
                case "inventario":
                    console.log("\n-- INVENTÁRIO --");
                    console.log(this.#mochila.inventario());
                    console.log("----------------\n");
                    break;
                
                case "usa":
                    if (tokens.length < 3) { 
                        console.log("Comando incompleto. Use: usa [ferramenta] [objeto]"); 
                        break; 
                    }
                    try {
                        if (this.salaCorrente.usa(tokens[1], tokens[2])) {
                            console.log("Ação realizada com sucesso!");
                            if (this.#fim == true) { 
                                console.log("\n*** PARABÉNS! VOCÊ VENCEU O JOGO! ***");
                            }
                        } else {
                            console.log(`Não foi possível realizar a ação.`);
                        }
                    } catch (error) {
                        if (error.message.includes("Fim de Jogo:")) {
                            console.log("\n*** FIM DE JOGO ***");
                            console.log(error.message); 
                            this.indicaFimDeJogo(); 
                        } else {
                            console.error("Um erro inesperado ocorreu:", error);
                            this.indicaFimDeJogo(); 
                        }
                    }
                    break;
                
                case "sai":
                    if (tokens.length < 2) { 
                        console.log("Comando incompleto. Use: sai [nome_da_porta]"); 
                        break; 
                    }
                    novaSala = this.salaCorrente.sai(tokens[1]); 
                    
                    if (novaSala == null) {
                        console.log(`Não há uma saída chamada '${tokens[1].replace(/_/g, " ")}' daqui.`);
                    } else {
                        this.#salaCorrente = novaSala;
                    }
                    break;

                case "descartar": // <<<<----- NOVO COMANDO ----->>>>
                    if (tokens.length < 2) { 
                        console.log("Comando incompleto. Use: descartar [ferramenta]"); 
                        break; 
                    }
                    if (this.#mochila.remove(tokens[1])) {
                        console.log(`A ferramenta '${tokens[1]}' foi descartada da mochila.`);
                    } else {
                        console.log(`A ferramenta '${tokens[1]}' não foi encontrada na mochila para descarte.`);
                    }
                    break;
                
                default:
                    console.log(`Comando desconhecido: '${tokens[0]}'. Tente 'pega', 'usa', 'sai', 'inventario', 'descartar' ou 'fim'.`);
                    break;
            }
        }
        console.log("\n-------------------------");
        console.log("JOGO ENCERRADO.");
        console.log("-------------------------\n");
    }
}