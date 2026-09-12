import { validate } from "bycontract";
import { Sala, Engine, Ferramenta, Objeto } from "./Basicas.js";
// Importa classes base: Sala, Engine, Ferramenta, Objeto
import { PaEnferrujada, PanoUmedo, FosforosSecos, Bateria, ChaveEnferrujada, ChavePequena, LanternaCarregada, AmuletoAncestral } from "./FerramentasAventura.js";
// Importa todas as subclasses de Ferramenta
import { CandelabroEmpoeirado, LivrosAntigos, ArmarioTrancado, FosforosUmdos, BauAntigo, BilheteRasgado, Pedestal, LanternaDescarregada as LanternaDescarregadaObjeto } from "./ObjetosAventura.js";
// Importa todas as subclasses de Objeto (LanternaDescarregada renomeada para evitar conflito com a Ferramenta)

/**
 * @class JardimSecreto
 * @augments Sala
 * @description Sala inicial do jogo. Contém a lógica para usar a pá e encontrar a chave enferrujada.
 */
export class JardimSecreto extends Sala {
    chaveEnferrujadaEncontrada; // Flag que indica se a chave já foi revelada

    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Jardim_Secreto", engine);
        // Ferramenta disponível para ser pega
        this.ferramentas.set("pa_enferrujada", new PaEnferrujada());
        this.chaveEnferrujadaEncontrada = false;
    }

    /**
     * @method usa
     * @description Sobrescreve o usa() da Sala para adicionar a lógica de cavar no Jardim.
     * @param {string} ferramentaNome Nome da ferramenta usada.
     * @param {string} objetoNome Nome do objeto de interação ("terra").
     * @returns {boolean} True se a ação foi bem-sucedida, False caso contrário.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        if (ferramentaNome === "pa_enferrujada" && objetoNome === "terra") {
            let pa = this.engine.mochila.pega(ferramentaNome);
            if (!pa) {
                console.log(`Ferramenta '${ferramentaNome}' não está na mochila.`);
                return false;
            }
            // A lógica de uso da ferramenta deve vir ANTES da lógica do objeto, pois ela pode falhar.
            if (!pa.usar()) { 
                console.log(`A ferramenta '${ferramentaNome}' não pode mais ser usada.`);
                return false;
            }
            
            if (!this.chaveEnferrujadaEncontrada) {
                console.log("Você cava na terra e encontra uma chave enferrujada!");
                // Adiciona a nova ferramenta à sala para que o jogador possa pegá-la
                this.ferramentas.set("chave_enferrujada", new ChaveEnferrujada());
                this.chaveEnferrujadaEncontrada = true;
            } else {
                console.log("A terra já foi cavada. Não há mais nada aqui.");
            }
            return true;
        }
        // Para todas as outras interações (ex: "usa chave_enferrujada em porta"), chama a lógica base
        return super.usa(ferramentaNome, objetoNome); 
    }
}

/**
 * @class HallEntrada
 * @augments Sala
 * @description Sala que contém o Candelabro, cuja ativação desbloqueia uma nova porta em outra sala.
 */
export class HallEntrada extends Sala {
    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Hall_de_Entrada", engine);
        this.objetos.set("candelabro_empoeirado", new CandelabroEmpoeirado());
        this.ferramentas.set("pano_umedo", new PanoUmedo());
    }

    /**
     * @method usa
     * @description Lógica específica para o candelabro, incluindo a verificação de derrota e o desbloqueio de porta.
     * @param {string} ferramentaNome Nome da ferramenta usada.
     * @param {string} objetoNome Nome do objeto de interação.
     * @returns {boolean} True se a ação foi bem-sucedida.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        if (objetoNome === "candelabro_empoeirado") {
            let candelabro = this.objetos.get(objetoNome);
            let ferramenta = this.engine.mochila.pega(ferramentaNome); 

            if (!candelabro || !ferramenta) {
                console.log(`Não é possível usar '${ferramentaNome}' sobre '${objetoNome}'. Ferramenta ou objeto não disponível ou não está na mochila.`);
                return false;
            }
            
            // Tenta usar a ferramenta e lida com consumo
            if (!ferramenta.usar()) {
                console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
                return false;
            }

            let usou = false;
            try {
                usou = candelabro.usar(ferramenta); 
            } catch (error) {
                // Captura a exceção de derrota específica do candelabro
                if (error.message.includes("Fim de Jogo:")) {
                    console.log(error.message); 
                    this.engine.indicaFimDeJogo(); // Define o fim de jogo
                    return true; // Retorna true para processamento bem-sucedido (embora seja derrota)
                }
                throw error; // Propaga outros erros
            }

            if (usou) {
                console.log(`Ação realizada com sucesso! Candelabro agora: ${candelabro.descricao}`); 
                
                if (candelabro.acaoOk) { // Condição para desbloqueio: Candelabro está Limpo E Aceso
                    let salaLeitura = this.engine.mapaSalas.get("Sala_de_Leitura");
                    let corredorSecreto = this.engine.mapaSalas.get("Corredor_Secreto");

                    // Adiciona a porta se ainda não estiver lá
                    if (salaLeitura && corredorSecreto && !salaLeitura.portas.has("Corredor_Secreto")) {
                        console.log("A luz do candelabro revela uma passagem escondida na Sala de Leitura!");
                        salaLeitura.portas.set("Corredor_Secreto", corredorSecreto);
                        corredorSecreto.portas.set("Sala_de_Leitura", salaLeitura); // Mapeamento bidirecional
                    }
                }
                return true;
            }
            return false;
        }
        return super.usa(ferramentaNome, objetoNome);
    }
}

/**
 * @class SalaLeitura
 * @augments Sala
 * @description Sala com objetos que revelam novas ferramentas (Lanterna Carregada) e portas (Corredor Secreto).
 */
export class SalaLeitura extends Sala {
    chavePequenaEncontrada; // Flag que indica se a chave pequena já foi revelada

    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_de_Leitura", engine);
        this.objetos.set("livros_antigos", new LivrosAntigos());
        this.objetos.set("lanterna_descarregada", new LanternaDescarregadaObjeto()); 
        this.chavePequenaEncontrada = false;
    }

    /**
     * @method usa
     * @description Lógica para usar a lanterna nos livros e carregar a lanterna com a bateria.
     * @param {string} ferramentaNome Nome da ferramenta usada.
     * @param {string} objetoNome Nome do objeto de interação.
     * @returns {boolean} True se a ação foi bem-sucedida.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            console.log(`Não é possível usar '${ferramentaNome}' sobre '${objetoNome}'. Ferramenta ou objeto não disponível ou não está na mochila.`);
            return false;
        }

        // Tenta usar a ferramenta (lógica de consumo)
        if (!ferramenta.usar()) { 
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "livros_antigos") {
            let livros = objeto;
            
            // Só a LanternaCarregada revela os segredos dos livros
            if (!(ferramenta instanceof LanternaCarregada)) { 
                console.log(`A ferramenta '${ferramentaNome}' não é adequada para os livros.`);
                return false;
            }
            
            let usou = livros.usar(ferramenta);
            if (usou && livros.chaveRevelada && !this.chavePequenaEncontrada) {
                console.log("Você encontra uma chave pequena e uma nova passagem se revela!");
                // Adiciona a nova ferramenta à sala
                this.ferramentas.set("chave_pequena", new ChavePequena());
                this.chavePequenaEncontrada = true;
                
                // Desbloqueia o Corredor Secreto a partir do Quarto Principal
                let quartoPrincipal = this.engine.mapaSalas.get("Quarto_Principal");
                let corredorSecreto = this.engine.mapaSalas.get("Corredor_Secreto");
                if (quartoPrincipal && corredorSecreto) {
                    quartoPrincipal.portas.set("Corredor_Secreto", corredorSecreto);
                    corredorSecreto.portas.set("Quarto_Principal", quartoPrincipal);
                    console.log("O Corredor Secreto está agora acessível do Quarto Principal.");
                }
                return true;
            }
            return usou; 
        } else if (objetoNome === "lanterna_descarregada") {
            let lanternaObjeto = objeto;
            
            // Só a Bateria interage com a lanterna
            if (!(ferramenta instanceof Bateria)) { 
                console.log(`A ferramenta '${ferramentaNome}' não é adequada para a lanterna.`);
                return false;
            }
            
            let usou = lanternaObjeto.usar(ferramenta);
            if (usou && lanternaObjeto.carregada) {
                console.log("A lanterna está carregada! Você pode pegá-la agora.");
                // Remove o objeto (lanterna descarregada) e o substitui pela Ferramenta (lanterna carregada)
                this.objetos.delete(objetoNome); 
                this.ferramentas.set("lanterna_carregada", new LanternaCarregada()); 
                // A Bateria (ferramenta de 1 uso) já foi consumida pelo .usar() anterior.
                return true;
            }
            return false;
        }
        return super.usa(ferramentaNome, objetoNome);
    }
}


/**
 * @class CozinhaVelha
 * @augments Sala
 * @description Sala com objetos que guardam ferramentas (Armário) ou requerem transformação (Fósforos Úmidos).
 */
export class CozinhaVelha extends Sala {
    bateriaEncontrada;
    fosforosSecosDisponiveis;

    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Cozinha_Velha", engine);
        this.objetos.set("armario_trancado", new ArmarioTrancado());
        this.objetos.set("fosforos_umdos", new FosforosUmdos());
        this.bateriaEncontrada = false;
        this.fosforosSecosDisponiveis = false;
    }

    /**
     * @method usa
     * @description Lógica para abrir o armário e secar os fósforos.
     * @param {string} ferramentaNome Nome da ferramenta usada.
     * @param {string} objetoNome Nome do objeto de interação.
     * @returns {boolean} True se a ação foi bem-sucedida.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            console.log(`Não é possível usar '${ferramentaNome}' sobre '${objetoNome}'. Ferramenta ou objeto não disponível ou não está na mochila.`);
            return false;
        }

        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "armario_trancado") {
            let armario = objeto;
            if (!(ferramenta instanceof ChaveEnferrujada)) { 
                console.log(`A ferramenta '${ferramentaNome}' não é adequada para o armário.`);
                return false;
            }

            let usou = armario.usar(ferramenta);
            if (usou && armario.bateriaRevelada && !this.bateriaEncontrada) {
                console.log("O armário se abre e você encontra uma bateria!");
                this.ferramentas.set("bateria", new Bateria());
                this.bateriaEncontrada = true;
                return true;
            }
            return false;
        } else if (objetoNome === "fosforos_umdos") {
            let fosforos = objeto;
            if (!(ferramenta instanceof PanoUmedo)) { 
                console.log(`A ferramenta '${ferramentaNome}' não é adequada para os fósforos.`);
                return false;
            }

            let usou = fosforos.usar(ferramenta);
            if (usou && fosforos.secos && !this.fosforosSecosDisponiveis) {
                console.log("Os fósforos estão secos! Você pode pegá-los.");
                // Remove o objeto (fósforos úmidos) e o substitui pela Ferramenta (fósforos secos)
                this.objetos.delete(objetoNome); 
                this.ferramentas.set("fosforos_secos", new FosforosSecos()); 
                this.fosforosSecosDisponiveis = true;
                return true;
            }
            return false;
        }
        return super.usa(ferramentaNome, objetoNome);
    }
}

/**
 * @class Despensa
 * @augments Sala
 * @description Sala simples, sem lógica de interação (pode ser expandida).
 */
export class Despensa extends Sala {
    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Despensa", engine);
    }
}

/**
 * @class QuartoPrincipal
 * @augments Sala
 * @description Sala com o baú que contém a ferramenta final (Amuleto Ancestral).
 */
export class QuartoPrincipal extends Sala {
    amuletoEncontrado;

    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Quarto_Principal", engine);
        this.objetos.set("bau_antigo", new BauAntigo());
        this.objetos.set("bilhete_rasgado", new BilheteRasgado());
        this.amuletoEncontrado = false;
    }

    /**
     * @method usa
     * @description Lógica para abrir o baú e revelar o amuleto.
     * @param {string} ferramentaNome Nome da ferramenta usada.
     * @param {string} objetoNome Nome do objeto de interação.
     * @returns {boolean} True se a ação foi bem-sucedida.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            console.log(`Não é possível usar '${ferramentaNome}' sobre '${objetoNome}'. Ferramenta ou objeto não disponível ou não está na mochila.`);
            return false;
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "bau_antigo") {
            let bau = objeto;
            if (!(ferramenta instanceof ChavePequena)) { 
                console.log(`A ferramenta '${ferramentaNome}' não é adequada para o baú.`);
                return false;
            }

            let usou = bau.usar(ferramenta);
            if (usou && bau.amuletoRevelado && !this.amuletoEncontrado) {
                console.log("O baú se abre e revela o Amuleto Ancestral!");
                // Adiciona o Amuleto à sala para ser pego
                this.ferramentas.set("amuleto_ancestral", new AmuletoAncestral()); 
                this.amuletoEncontrado = true;
                return true;
            }
            return false;
        }
        return super.usa(ferramentaNome, objetoNome);
    }
}

/**
 * @class CorredorSecreto
 * @augments Sala
 * @description Sala de ligação que é desbloqueada dinamicamente por ações em outras salas.
 */
export class CorredorSecreto extends Sala {
    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Corredor_Secreto", engine);
    }
}

/**
 * @class SantuarioOculto
 * @augments Sala
 * @description A sala final do jogo, onde o objetivo da vitória é alcançado.
 */
export class SantuarioOculto extends Sala {
    /**
     * @constructor
     * @param {Engine} engine A instância da Engine do jogo.
     */
    constructor(engine) {
        validate(engine, Engine);
        super("Santuario_Oculto", engine);
        this.objetos.set("pedestal", new Pedestal());
    }

    /**
     * @method usa
     * @description Lógica final do jogo: usar o Amuleto no pedestal leva à vitória.
     * @param {string} ferramentaNome Nome da ferramenta usada.
     * @param {string} objetoNome Nome do objeto de interação.
     * @returns {boolean} True se a ação foi bem-sucedida.
     */
    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            console.log(`Não é possível usar '${ferramentaNome}' sobre '${objetoNome}'. Ferramenta ou objeto não disponível ou não está na mochila.`);
            return false;
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "pedestal") {
            let pedestal = objeto;
            if (!(ferramenta instanceof AmuletoAncestral)) {
                console.log(`A ferramenta '${ferramentaNome}' não é adequada para o pedestal.`);
                return false;
            }

            let usou = pedestal.usar(ferramenta);
            if (usou) {
                // Ação de sucesso no objeto; notifica a Engine para terminar o jogo.
                this.engine.indicaFimDeJogo(); 
                return true;
            }
            return false;
        }
        return super.usa(ferramentaNome, objetoNome);
    }
}