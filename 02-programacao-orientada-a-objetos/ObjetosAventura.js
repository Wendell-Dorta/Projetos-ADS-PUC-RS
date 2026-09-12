import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
// Importa as classes base.
import { PanoUmedo, FosforosSecos, Bateria, ChaveEnferrujada, ChavePequena, LanternaCarregada, AmuletoAncestral } from "./FerramentasAventura.js"; 
// Importa todas as subclasses de Ferramenta para verificar o tipo correto em 'usar'.

// ----------------------------------------------------------------------
// OBJETOS INTERATIVOS
// ----------------------------------------------------------------------

/**
 * @class CandelabroEmpoeirado
 * @augments Objeto
 * @description Objeto de duas etapas de interação: precisa ser limpo e depois aceso.
 * Ação de Derrota: Usar fósforos errados (simulada por um nome de ferramenta específico).
 */
export class CandelabroEmpoeirado extends Objeto {
    #limpo; // Estado privado: true se já foi limpo, false caso contrário.

    constructor() {
        super("candelabro_empoeirado",
              "sujo. Parece que precisa de limpeza e luz.", // Descrição inicial (Sujo e Apagado)
              "limpo e aceso, iluminando o hall."); // Descrição final (Limpo E Aceso)
        this.#limpo = false;
    }

    get limpo() {
        return this.#limpo;
    }

    /**
     * @method usar
     * @description Define as interações específicas para o candelabro.
     * 1. PanoUmedo: Limpa (define #limpo = true).
     * 2. FosforosSecos: Acende (define acaoOk = true), mas só se já estiver limpo.
     * 3. 'fosforos_umdos': Causa o Fim do Jogo (Derrota).
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida.
     * @throws {Error} Exceção de "Fim de Jogo" se a ação for fatal.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        
        if (ferramenta instanceof PanoUmedo && !this.#limpo) {
            console.log("Você limpa o candelabro. Agora ele está pronto para ser aceso.");
            this.#limpo = true; 
            return true;
        } 
        else if (ferramenta instanceof FosforosSecos && this.#limpo && !this.acaoOk) {
            console.log("Você acende o candelabro. O hall é iluminado!");
            this.acaoOk = true; 
            return true;
        } 
        // Simulação de item perigoso (nome de ferramenta que não é uma classe)
        else if (ferramenta && ferramenta.nome === "fosforos_umdos") { 
            throw new Error("Fim de Jogo: Você foi asfixiado pela fumaça tóxica!");
        }
        return false;
    }

    /**
     * @property {string} descricao Sobrescreve a descrição para incluir o estado intermediário (#limpo).
     */
    get descricao() {
        if (this.acaoOk) { 
            return this._descricaoDepoisAcao; // Limpo e Aceso
        } else if (this.#limpo) { 
            return "limpo, mas ainda escuro. Precisa ser aceso."; // Limpo, mas Apagado
        } else { 
            return this._descricaoAntesAcao; // Sujo e Apagado
        }
    }
}

/**
 * @class LivrosAntigos
 * @augments Objeto
 * @description Revela uma chave e uma passagem secreta quando iluminado.
 */
export class LivrosAntigos extends Objeto {
    chaveRevelada; // Indica se a ChavePequena já foi encontrada.
    passagemRevelada; // Indica se a Passagem Secreta já foi revelada (açãoOk = true).

    constructor() {
        super("livros_antigos",
              "Uma pilha de livros empoeirados. Parecem esconder algo.",
              "Os livros foram revirados, revelando uma chave pequena e uma passagem oculta!");
        this.chaveRevelada = false;
        this.passagemRevelada = false;
    }

    /**
     * @method usar
     * @description A LanternaCarregada é usada para encontrar a chave e a passagem.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof LanternaCarregada) {
            if (!this.chaveRevelada) {
                console.log("Com a luz da lanterna, você encontra uma chave pequena entre os livros e uma passagem escondida atrás da estante!");
                this.chaveRevelada = true;
                this.passagemRevelada = true;
            }
            this.acaoOk = true; // Marca que a ação principal de revelação foi feita.
            // Nota: A lógica de adicionar a ferramenta 'chave_pequena' à sala e a porta 'corredor_secreto'
            // na SalaLeitura deve ser feita na SalaLeitura.usa() onde este objeto está contido.
            return true;
        }
        return false;
    }
}

/**
 * @class ArmarioTrancado
 * @augments Objeto
 * @description Objeto que guarda uma Bateria e é aberto por uma chave específica.
 */
export class ArmarioTrancado extends Objeto {
    bateriaRevelada; // Indica se a Bateria já foi encontrada.

    constructor() {
        super("armario_trancado",
              "Um armário de madeira, trancado.",
              "O armário está aberto. Dentro, há uma bateria.");
        this.bateriaRevelada = false;
    }

    /**
     * @method usar
     * @description A ChaveEnferrujada abre o armário e revela a bateria.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof ChaveEnferrujada) {
            if (!this.bateriaRevelada) {
                console.log("Você abre o armário com a chave enferrujada e encontra uma bateria!");
                this.bateriaRevelada = true;
            }
            this.acaoOk = true;
            // Nota: A lógica de adicionar a ferramenta 'bateria' à sala deve ser feita na Sala onde este objeto está contido.
            return true;
        }
        return false;
    }
}

/**
 * @class FosforosUmdos
 * @augments Objeto
 * @description Representa um item que precisa ser melhorado (seco) para se tornar uma ferramenta útil.
 * No contexto do jogo, é um 'Objeto' que se transforma em 'FosforosSecos' (Ferramenta).
 */
export class FosforosUmdos extends Objeto {
    secos; // Indica se os fósforos já foram secos.

    constructor() {
        super("fosforos_umdos",
              "Uma caixa de fósforos úmidos. Não servem para acender nada assim.",
              "Os fósforos estão secos e prontos para uso!");
        this.secos = false;
    }

    /**
     * @method usar
     * @description Usa o PanoUmedo para secar os fósforos.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof PanoUmedo && !this.secos) {
            console.log("Você usa o pano úmido para secar os fósforos.");
            this.secos = true;
            this.acaoOk = true; // Objeto agora é considerado 'modificado'.
            // Nota: A lógica de remover 'fosforos_umdos' (Ferramenta) e adicionar 'FosforosSecos' (Ferramenta)
            // deve ser tratada na Sala onde este objeto reside.
            return true;
        }
        return false;
    }
}

/**
 * @class BauAntigo
 * @augments Objeto
 * @description Objeto que guarda o Amuleto Ancestral, chave para a vitória.
 */
export class BauAntigo extends Objeto {
    amuletoRevelado; // Indica se o Amuleto Ancestral já foi encontrado.

    constructor() {
        super("bau_antigo",
              "Um baú de madeira com um cadeado antigo.",
              "O baú está aberto. Lá dentro, está o Amuleto Ancestral!");
        this.amuletoRevelado = false;
    }

    /**
     * @method usar
     * @description A ChavePequena abre o baú e revela o Amuleto.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof ChavePequena) {
            if (!this.amuletoRevelado) {
                console.log("Você usa a chave pequena e o baú se abre, revelando um brilho estranho... é o Amuleto Ancestral!");
                this.amuletoRevelado = true;
            }
            this.acaoOk = true;
            // Nota: A lógica de adicionar a ferramenta 'amuleto_ancestral' à sala deve ser feita na Sala.
            return true;
        }
        return false;
    }
}

/**
 * @class BilheteRasgado
 * @augments Objeto
 * @description Objeto que fornece uma dica, cuja descrição muda ao ser "lido" (interagido).
 */
export class BilheteRasgado extends Objeto {
    constructor() {
        super("bilhete_rasgado",
              "Há um pedaço de bilhete. Está rasgado: '...revela o caminho, mas a...guarda o segredo do baú. O...se esgota...'",
              "O bilhete completo diz: 'A luz revela o caminho, mas a escuridão guarda o segredo do baú. O tempo se esgota...'"); 
    }

    /**
     * @method usar
     * @description Exemplo de um objeto que muda de estado apenas para fins de narrativa/informação.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true.
     */
    usar(ferramenta) { 
        validate(ferramenta, Ferramenta);
        // Aqui o jogo supõe um comando de leitura mapeado para uma ferramenta imaginária "olhos"
        if (ferramenta.nome === "olhos") { 
            this.acaoOk = true; 
            console.log(this.descricao);
            return true;
        }
        return false;
    }
}

/**
 * @class Pedestal
 * @augments Objeto
 * @description Objeto final do jogo. Usar o Amuleto Ancestral nele deve levar à vitória.
 */
export class Pedestal extends Objeto {
    constructor() {
        super("pedestal",
              "Um pedestal de pedra no centro da sala. Há um encaixe no topo.",
              "O Amuleto Ancestral está no pedestal, ativado! A mansão parece respirar novamente.");
    }

    /**
     * @method usar
     * @description O Amuleto Ancestral é colocado no pedestal. Esta ação deve acionar o fim de jogo (vitória) na Engine.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof AmuletoAncestral) { 
            this.acaoOk = true;
            // Nota: A Engine precisa ser notificada aqui (ou na Sala.usa()) para terminar o jogo com sucesso.
            return true;
        }
        return false;
    }
}

/**
 * @class LanternaDescarregada
 * @augments Objeto
 * @description Um objeto que se transforma na ferramenta Lanterna Carregada.
 */
export class LanternaDescarregada extends Objeto {
    carregada; // Indica se a lanterna já foi carregada.

    constructor() {
        super("lanterna_descarregada",
              "Uma lanterna antiga, mas sem luz. Parece que precisa de uma bateria.",
              "A lanterna está carregada e funciona! (pegue-a para usar)");
        this.carregada = false;
    }

    /**
     * @method usar
     * @description A Bateria carrega a lanterna.
     * @param {Ferramenta} ferramenta A ferramenta usada.
     * @returns {boolean} Retorna true se a ação foi bem-sucedida.
     */
    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof Bateria && !this.carregada) {
            console.log("Você insere a bateria na lanterna. Ela agora está carregada!");
            this.carregada = true;
            this.acaoOk = true;
            // Nota: A lógica de adicionar a ferramenta LanternaCarregada na sala e remover a Bateria usada deve ser tratada na Sala.
            return true;
        }
        return false;
    }
}