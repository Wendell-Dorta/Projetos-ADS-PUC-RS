import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { PanoUmedo, FosforosSecos, Bateria, ChaveEnferrujada, ChavePequena, LanternaCarregada, AmuletoAncestral, ChaveMisteriosa, RegadorAbencoado, RoloBarbante, BaldeAgua, PocaoMagica, Olhos, ChaveAntiga } from "./FerramentasAventura.js"; 

// ----------------------------------------------------------------------
// OBJETOS INTERATIVOS
// ----------------------------------------------------------------------

export class CandelabroEmpoeirado extends Objeto {
    #limpo;

    constructor() {
        super("candelabro_empoeirado",
              "sujo. Parece que precisa de limpeza e luz.",
              "limpo e aceso, iluminando o hall.");
        this.#limpo = false;
    }

    get limpo() {
        return this.#limpo;
    }

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
        else if (ferramenta && ferramenta.nome === "fosforos_umdos") { 
            throw new Error("Fim de Jogo: Você foi asfixiado pela fumaça tóxica!");
        }
        return false;
    }

    get descricao() {
        if (this.acaoOk) { 
            return this._descricaoDepoisAcao;
        } else if (this.#limpo) { 
            return "limpo, mas ainda escuro. Precisa ser aceso.";
        } else { 
            return this._descricaoAntesAcao;
        }
    }
}

export class LivrosAntigos extends Objeto {
    chaveRevelada;
    passagemRevelada;

    constructor() {
        super("livros_antigos",
              "Uma pilha de livros empoeirados. Parecem esconder algo.",
              "Os livros foram revirados, revelando uma chave pequena e uma passagem oculta!");
        this.chaveRevelada = false;
        this.passagemRevelada = false;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof LanternaCarregada) {
            if (!this.chaveRevelada) {
                console.log("Com a luz da lanterna, você encontra uma chave pequena entre os livros e uma passagem escondida atrás da estante!");
                this.chaveRevelada = true;
                this.passagemRevelada = true;
            }
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class ArmarioTrancado extends Objeto {
    bateriaRevelada;

    constructor() {
        super("armario_trancado",
              "Um armário de madeira, trancado.",
              "O armário está aberto. Dentro, há uma bateria.");
        this.bateriaRevelada = false;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof ChaveEnferrujada) {
            if (!this.bateriaRevelada) {
                console.log("Você abre o armário com a chave enferrujada e encontra uma bateria!");
                this.bateriaRevelada = true;
            }
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class FosforosUmdos extends Objeto {
    secos;

    constructor() {
        super("fosforos_umdos",
              "Uma caixa de fósforos úmidos. Não servem para acender nada assim.",
              "Os fósforos estão secos e prontos para uso!");
        this.secos = false;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof PanoUmedo && !this.secos) {
            console.log("Você usa o pano úmido para secar os fósforos.");
            this.secos = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class BauAntigo extends Objeto {
    amuletoRevelado;

    constructor() {
        super("bau_antigo",
              "Um baú de madeira com um cadeado antigo.",
              "O baú está aberto. Lá dentro, está o Amuleto Ancestral!");
        this.amuletoRevelado = false;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof ChavePequena) {
            if (!this.amuletoRevelado) {
                console.log("Você usa a chave pequena e o baú se abre, revelando um brilho estranho... é o Amuleto Ancestral!");
                this.amuletoRevelado = true;
            }
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class BilheteRasgado extends Objeto {
    constructor() {
        super("bilhete_rasgado",
              "Há um pedaço de bilhete. Está rasgado: '...revela o caminho, mas a...guarda o segredo do baú. O...se esgota...'",
              "O bilhete completo diz: 'A luz revela o caminho, mas a escuridão guarda o segredo do baú. O tempo se esgota...'"); 
    }

    usar(ferramenta) { 
        validate(ferramenta, Ferramenta);
        // <<<<----- CORREÇÃO CHAVE AQUI ----->>>>
        // Usa 'instanceof Olhos' em vez de 'ferramenta.nome === "olhos"'
        if (ferramenta instanceof Olhos && !this.acaoOk) { 
            this.acaoOk = true; 
            console.log(`Você lê o bilhete: ${this.descricao}`);
            return true;
        }
        return false;
    }
}

export class Pedestal extends Objeto {
    constructor() {
        super("pedestal",
              "Um pedestal de pedra no centro da sala. Há um encaixe no topo.",
              "O Amuleto Ancestral está no pedestal, ativado! A mansão parece respirar novamente.");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof AmuletoAncestral) { 
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class LanternaDescarregada extends Objeto {
    carregada;

    constructor() {
        super("lanterna_descarregada",
              "Uma lanterna antiga, mas sem luz. Parece que precisa de uma bateria.",
              "A lanterna está carregada e funciona! (pegue-a para usar)");
        this.carregada = false;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof Bateria && !this.carregada) {
            console.log("Você insere a bateria na lanterna. Ela agora está carregada!");
            this.carregada = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class CaixaVelhaTrancada extends Objeto {
    #aberta;

    constructor() {
        super("caixa_velha_trancada",
              "Uma caixa velha de madeira, trancada.",
              "A caixa velha está aberta. Dentro, há um diário antigo e um balde com água.");
        this.#aberta = false;
    }

    get aberta() {
        return this.#aberta;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof ChaveMisteriosa && !this.#aberta) {
            console.log("Você usa a chave e a caixa se abre, revelando um diário antigo e um balde com água!");
            this.#aberta = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class DiarioAntigo extends Objeto {
    constructor() {
        super("diario_antigo",
              "Um diário velho e empoeirado. Parece ter anotações importantes.",
              "Você lê o diário. Ele fala sobre um regador abençoado para a planta mística e uma chave antiga...");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        // <<<<----- CORREÇÃO CHAVE AQUI ----->>>>
        // Usa 'instanceof Olhos' em vez de 'ferramenta.nome === "olhos"'
        if (ferramenta instanceof Olhos && !this.acaoOk) { 
            this.acaoOk = true;
            console.log(`Você lê as páginas amareladas do diário: ${this.descricao}`);
            return true;
        }
        return false;
    }
}

export class PlantaMisteriosaRessequida extends Objeto {
    #regada;

    constructor() {
        super("planta_misteriosa_ressequida",
              "Uma planta murcha e misteriosa. Parece precisar de água.",
              "A planta floresceu, revelando um portão oculto em suas folhagens!");
        this.#regada = false;
    }

    get regada() {
        return this.#regada;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof RegadorAbencoado && !this.#regada) {
            console.log("Você rega a planta. Ela começa a crescer rapidamente e revela algo!");
            this.#regada = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class PortaoTrancadoAntigo extends Objeto {
    #aberto;

    constructor() {
        super("portao_trancado_antigo",
              "Um portão de ferro coberto por hera, trancado com um cadeado antigo.",
              "O portão se abriu, revelando um caminho úmido para a Estufa Abandonada.");
        this.#aberto = false;
    }

    get aberto() {
        return this.#aberto;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof ChaveAntiga && !this.#aberto) { 
            console.log("Você usa a chave antiga e o portão se destranca e abre!");
            this.#aberto = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class IngredientesEstranhos extends Objeto {
    constructor() {
        super("ingredientes_estranhos",
              "Uma mistura de ervas e pós de aparência suspeita. Parecem ser para alguma poção.",
              "Os ingredientes foram adicionados à destilaria.");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta.nome === "destilaria_consertada_com_agua" && !this.acaoOk) { 
            console.log("Você adiciona os ingredientes à destilaria.");
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class PiaSeca extends Objeto {
    #comAgua;

    constructor() {
        super("pia_seca",
              "Uma pia velha e suja, sem água. Parece que um balde de água a encheria.",
              "A pia agora está cheia de água limpa.");
        this.#comAgua = false;
    }

    get comAgua() {
        return this.#comAgua;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof BaldeAgua && !this.#comAgua) {
            console.log("Você despeja a água na pia. Ela agora está cheia!");
            this.#comAgua = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class DestilariaQuebrada extends Objeto {
    #consertada;

    constructor() {
        super("destilaria_quebrada",
              "Uma destilaria antiga e quebrada. O barbante poderia consertá-la.",
              "A destilaria foi consertada e agora pode ser usada.");
        this.#consertada = false;
    }

    get consertada() {
        return this.#consertada;
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof RoloBarbante && !this.#consertada) {
            console.log("Você usa o rolo de barbante para consertar a destilaria.");
            this.#consertada = true;
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}

export class RitualMisterioso extends Objeto {
    constructor() {
        super("ritual_misterioso",
              "Um círculo de pedras e símbolos antigos, esperando por uma oferenda.",
              "O ritual foi completado! O segredo final da mansão foi revelado.");
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        if (ferramenta instanceof PocaoMagica && !this.acaoOk) {
            console.log("Você derrama a poção no centro do ritual. As pedras brilham intensamente!");
            this.acaoOk = true;
            return true;
        }
        return false;
    }
}