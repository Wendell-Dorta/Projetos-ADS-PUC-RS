import { validate } from "bycontract";
import { Sala, Engine, Ferramenta, Objeto } from "./Basicas.js";
// <<<<----- CORREÇÃO CHAVE AQUI: Adicionar Olhos e ChaveAntiga à lista de FerramentasAventura.js ----->>>>
import { PaEnferrujada, PanoUmedo, FosforosSecos, Bateria, ChaveEnferrujada, ChavePequena, LanternaCarregada, AmuletoAncestral, ChaveMisteriosa, RegadorAbencoado, RoloBarbante, BaldeAgua, PocaoMagica, Olhos, ChaveAntiga } from "./FerramentasAventura.js";
import { CandelabroEmpoeirado, LivrosAntigos, ArmarioTrancado, FosforosUmdos, BauAntigo, BilheteRasgado, Pedestal, LanternaDescarregada as LanternaDescarregadaObjeto, PlantaMisteriosaRessequida, PortaoTrancadoAntigo, CaixaVelhaTrancada, DiarioAntigo, IngredientesEstranhos, PiaSeca, DestilariaQuebrada, RitualMisterioso } from "./ObjetosAventura.js";

/**
 * @class JardimSecreto
 * @augments Sala
 * @description Sala inicial do jogo. Contém a lógica para usar a pá e encontrar a chave enferrujada,
 * e a lógica da Fase 2 para a planta e o portão para a Estufa.
 */
export class JardimSecreto extends Sala {
    chaveEnferrujadaEncontrada;
    #portaoDescoberto; // Estado do portão (ligado ao objeto Planta)

    constructor(engine) {
        validate(engine, Engine);
        super("Jardim_Secreto", engine);
        this.ferramentas.set("pa_enferrujada", new PaEnferrujada());
        this.chaveEnferrujadaEncontrada = false;
        
        // Objetos para Fase 2
        this.objetos.set("planta_misteriosa_ressequida", new PlantaMisteriosaRessequida());
        this.objetos.set("portao_trancado_antigo", new PortaoTrancadoAntigo());
        this.#portaoDescoberto = false; 
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) { // Pré-validação de existência
            return super.usa(ferramentaNome, objetoNome); 
        }
        if (!ferramenta.usar()) { // Tenta usar a ferramenta, ela mesma lida com usos esgotados
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (ferramentaNome === "pa_enferrujada" && objetoNome === "terra") {
            if (!this.chaveEnferrujadaEncontrada) {
                console.log("Você cava na terra e encontra uma chave enferrujada!");
                this.ferramentas.set("chave_enferrujada", new ChaveEnferrujada());
                this.chaveEnferrujadaEncontrada = true;
            } else {
                console.log("A terra já foi cavada. Não há mais nada aqui.");
            }
            return true;
        }
        else if (objetoNome === "planta_misteriosa_ressequida") { 
            let planta = objeto;
            if (!(ferramenta instanceof RegadorAbencoado)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para a planta.`);
                return false;
            }
            if (planta.usar(ferramenta)) {
                this.#portaoDescoberto = true; 
                console.log(`Ação realizada com sucesso! ${planta.descricao}`);
                return true;
            }
            return false;
        }
        else if (objetoNome === "portao_trancado_antigo") { 
            let portao = objeto;
            if (!(ferramenta instanceof ChaveAntiga)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para o portão.`);
                return false;
            }
            if (!this.#portaoDescoberto) { 
                console.log("Você precisa descobrir como revelar este portão antes de tentar abri-lo.");
                return false;
            }
            if (portao.usar(ferramenta)) {
                let estufa = this.engine.mapaSalas.get("Estufa_Abandonada");
                if (estufa && !this.portas.has("Estufa_Abandonada")) {
                    this.portas.set("Estufa_Abandonada", estufa);
                    estufa.portas.set("jardim_secreto", this); // Bidirecional: o nome_da_porta é o nome "cru" da sala, em minúsculas
                    console.log(`Ação realizada com sucesso! ${portao.descricao}`);
                    console.log("A Estufa Abandonada está agora acessível.");
                }
                return true;
            }
            return false;
        }
        
        return super.usa(ferramentaNome, objetoNome);
    }
}

/**
 * @class HallEntrada
 * @augments Sala
 */
export class HallEntrada extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Hall_de_Entrada", engine);
        this.objetos.set("candelabro_empoeirado", new CandelabroEmpoeirado());
        this.ferramentas.set("pano_umedo", new PanoUmedo());
        this.ferramentas.set("chave_misteriosa", new ChaveMisteriosa());
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        if (objetoNome === "candelabro_empoeirado") {
            let candelabro = this.objetos.get(objetoNome);
            let ferramenta = this.engine.mochila.pega(ferramentaNome); 

            if (!candelabro || !ferramenta) {
                return super.usa(ferramentaNome, objetoNome);
            }
            
            if (!ferramenta.usar()) {
                console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
                return false;
            }

            let usou = false;
            try {
                usou = candelabro.usar(ferramenta); 
            } catch (error) {
                if (error.message.includes("Fim de Jogo:")) {
                    console.log(error.message); 
                    this.engine.indicaFimDeJogo();
                    return true;
                }
                throw error;
            }

            if (usou) {
                console.log(`Ação realizada com sucesso! Candelabro agora: ${candelabro.descricao}`); 
                
                if (candelabro.acaoOk) { 
                    let salaLeitura = this.engine.mapaSalas.get("Sala_de_Leitura");
                    let corredorSecreto = this.engine.mapaSalas.get("Corredor_Secreto");

                    if (salaLeitura && corredorSecreto && !salaLeitura.portas.has("corredor_secreto")) { // Chave de porta em minúsculas
                        salaLeitura.portas.set("corredor_secreto", corredorSecreto); // Chave de porta em minúsculas
                        corredorSecreto.portas.set("sala_de_leitura", salaLeitura); // Bidirecional
                        console.log("A luz do candelabro revela uma passagem escondida na Sala de Leitura!");
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
 */
export class SalaLeitura extends Sala {
    chavePequenaEncontrada;

    constructor(engine) {
        validate(engine, Engine);
        super("Sala_de_Leitura", engine);
        this.objetos.set("livros_antigos", new LivrosAntigos());
        this.objetos.set("lanterna_descarregada", new LanternaDescarregadaObjeto()); 
        this.chavePequenaEncontrada = false;
        this.ferramentas.set("olhos", new Olhos()); // Ferramenta para "ler" bilhetes/diários
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            return super.usa(ferramentaNome, objetoNome);
        }
        if (!ferramenta.usar()) { 
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "livros_antigos") {
            let livros = objeto;
            
            if (!(ferramenta instanceof LanternaCarregada)) { 
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para os livros.`);
                return false;
            }
            
            let usou = livros.usar(ferramenta);
            if (usou && livros.chaveRevelada && !this.chavePequenaEncontrada) {
                console.log("Você encontra uma chave pequena e uma nova passagem se revela!");
                this.ferramentas.set("chave_pequena", new ChavePequena());
                this.chavePequenaEncontrada = true;
                
                let quartoPrincipal = this.engine.mapaSalas.get("Quarto_Principal");
                let corredorSecreto = this.engine.mapaSalas.get("Corredor_Secreto");
                if (quartoPrincipal && corredorSecreto) {
                    if (!quartoPrincipal.portas.has("corredor_secreto")) { // Chave de porta em minúsculas
                        quartoPrincipal.portas.set("corredor_secreto", corredorSecreto); // Chave de porta em minúsculas
                        corredorSecreto.portas.set("quarto_principal", quartoPrincipal); // Bidirecional
                        console.log("O Corredor Secreto está agora acessível do Quarto Principal.");
                    }
                }
                return true;
            }
            return usou; 
        } else if (objetoNome === "lanterna_descarregada") {
            let lanternaObjeto = objeto;
            
            if (!(ferramenta instanceof Bateria)) { 
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para a lanterna.`);
                return false;
            }
            
            let usou = lanternaObjeto.usar(ferramenta);
            if (usou && lanternaObjeto.carregada) {
                console.log("A lanterna está carregada! Você pode pegá-la agora.");
                this.objetos.delete(objetoNome); 
                this.ferramentas.set("lanterna_carregada", new LanternaCarregada()); 
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
 */
export class CozinhaVelha extends Sala {
    bateriaEncontrada;
    fosforosSecosDisponiveis;

    constructor(engine) {
        validate(engine, Engine);
        super("Cozinha_Velha", engine);
        this.objetos.set("armario_trancado", new ArmarioTrancado());
        this.objetos.set("fosforos_umdos", new FosforosUmdos());
        this.ferramentas.set("regador_abencoado", new RegadorAbencoado()); 
        this.bateriaEncontrada = false;
        this.fosforosSecosDisponiveis = false;
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            return super.usa(ferramentaNome, objetoNome);
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "armario_trancado") {
            let armario = objeto;
            if (!(ferramenta instanceof ChaveEnferrujada)) { 
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para o armário.`);
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
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para os fósforos.`);
                return false;
            }

            let usou = fosforos.usar(ferramenta);
            if (usou && fosforos.secos && !this.fosforosSecosDisponiveis) {
                console.log("Os fósforos estão secos! Você pode pegá-los.");
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
 */
export class Despensa extends Sala {
    #caixaAberta;
    #diarioEncontrado;
    #baldeAguaEncontrado;

    constructor(engine) {
        validate(engine, Engine);
        super("Despensa", engine);
        this.objetos.set("caixa_velha_trancada", new CaixaVelhaTrancada());
        this.objetos.set("diario_antigo", new DiarioAntigo()); 
        this.ferramentas.set("rolo_de_barbante", new RoloBarbante()); 
        this.#caixaAberta = false;
        this.#diarioEncontrado = false;
        this.#baldeAguaEncontrado = false;
        this.ferramentas.set("olhos", new Olhos()); 
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            return super.usa(ferramentaNome, objetoNome);
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "caixa_velha_trancada") { 
            let caixa = objeto;
            if (!(ferramenta instanceof ChaveMisteriosa)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para a caixa.`);
                return false;
            }
            if (caixa.usar(ferramenta)) {
                this.#caixaAberta = true;
                if (!this.#diarioEncontrado) {
                    this.ferramentas.set("diario_antigo", new DiarioAntigo());
                    this.#diarioEncontrado = true;
                }
                if (!this.#baldeAguaEncontrado) {
                    this.ferramentas.set("balde_de_agua", new BaldeAgua());
                    this.#baldeAguaEncontrado = true;
                }
                console.log(`Ação realizada com sucesso! ${caixa.descricao}`);
                return true;
            }
            return false;
        }
        else if (objetoNome === "diario_antigo") { 
            let diario = objeto;
            if (!(ferramenta instanceof Olhos)) { 
                console.log(`Você não pode ler o '${objetoNome}' com '${ferramenta.nome}'.`);
                return false;
            }
            if (diario.usar(ferramenta)) {
                 return true;
            }
            return false;
        }
        
        return super.usa(ferramentaNome, objetoNome);
    }
}

/**
 * @class QuartoPrincipal
 * @augments Sala
 */
export class QuartoPrincipal extends Sala {
    amuletoEncontrado;

    constructor(engine) {
        validate(engine, Engine);
        super("Quarto_Principal", engine);
        this.objetos.set("bau_antigo", new BauAntigo());
        this.objetos.set("bilhete_rasgado", new BilheteRasgado());
        this.amuletoEncontrado = false;
        this.ferramentas.set("olhos", new Olhos()); 
        this.ferramentas.set("chave_antiga", new ChaveAntiga()); 
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            return super.usa(ferramentaNome, objetoNome);
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "bau_antigo") {
            let bau = objeto;
            if (!(ferramenta instanceof ChavePequena)) { 
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para o baú.`);
                return false;
            }

            let usou = bau.usar(ferramenta);
            if (usou && bau.amuletoRevelado && !this.amuletoEncontrado) {
                console.log("O baú se abre e revela o Amuleto Ancestral!");
                this.ferramentas.set("amuleto_ancestral", new AmuletoAncestral()); 
                this.amuletoEncontrado = true;
                return true;
            }
            return false;
        }
        else if (objetoNome === "bilhete_rasgado") { 
            let bilhete = objeto;
            if (!(ferramenta instanceof Olhos)) { 
                console.log(`Você não pode ler o '${objetoNome}' com '${ferramenta.nome}'.`);
                return false;
            }
            if (bilhete.usar(ferramenta)) {
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
 */
export class CorredorSecreto extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Corredor_Secreto", engine);
    }
}

/**
 * @class SantuarioOculto
 * @augments Sala
 */
export class SantuarioOculto extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Santuario_Oculto", engine);
        this.objetos.set("pedestal", new Pedestal());
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            return super.usa(ferramentaNome, objetoNome);
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "pedestal") {
            let pedestal = objeto;
            if (!(ferramenta instanceof AmuletoAncestral)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para o pedestal.`);
                return false;
            }

            let usou = pedestal.usar(ferramenta);
            if (usou) {
                this.engine.indicaFimDeJogo(); 
                return true;
            }
            return false;
        }
        return super.usa(ferramentaNome, objetoNome);
    }
}

/**
 * @class EstufaAbandonada
 * @augments Sala
 * @description Nova sala da Fase 2, focada em criar a Poção Mágica.
 */
export class EstufaAbandonada extends Sala {
    #piaComAgua;
    #destilariaConsertada;
    #ingredientesAdicionados;
    #pocaoFeita;

    constructor(engine) {
        validate(engine, Engine);
        super("Estufa_Abandonada", engine);
        this.objetos.set("ingredientes_estranhos", new IngredientesEstranhos());
        this.objetos.set("pia_seca", new PiaSeca());
        this.objetos.set("destilaria_quebrada", new DestilariaQuebrada());
        this.objetos.set("ritual_misterioso", new RitualMisterioso());

        this.#piaComAgua = false;
        this.#destilariaConsertada = false;
        this.#ingredientesAdicionados = false;
        this.#pocaoFeita = false;
    }

    usa(ferramentaNome, objetoNome) {
        validate(arguments, ["String", "String"]);

        let objeto = this.objetos.get(objetoNome);
        let ferramenta = this.engine.mochila.pega(ferramentaNome);

        if (!objeto || !ferramenta) {
            return super.usa(ferramentaNome, objetoNome);
        }
        if (!ferramenta.usar()) {
            console.log(`A ferramenta '${ferramenta.nome}' não pode mais ser usada.`);
            return false;
        }

        if (objetoNome === "pia_seca") {
            let pia = objeto;
            if (!(ferramenta instanceof BaldeAgua)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para a pia.`);
                return false;
            }
            if (pia.usar(ferramenta)) {
                this.#piaComAgua = true;
                console.log(`Ação realizada com sucesso! ${pia.descricao}`);
                return true;
            }
            return false;
        }
        else if (objetoNome === "destilaria_quebrada") {
            let destilaria = objeto;
            if (!(ferramenta instanceof RoloBarbante)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para a destilaria.`);
                return false;
            }
            if (destilaria.usar(ferramenta)) {
                this.#destilariaConsertada = true;
                this.objetos.delete("destilaria_quebrada"); 
                console.log(`Ação realizada com sucesso! ${destilaria.descricao}`);
                return true;
            }
            return false;
        }
        else if (objetoNome === "ingredientes_estranhos") { 
            let ingredientes = objeto;
            if (!this.#destilariaConsertada || !this.#piaComAgua) {
                console.log("Os ingredientes só podem ser usados na destilaria consertada e com água.");
                return false;
            }
            if (!this.#ingredientesAdicionados) {
                console.log("Você adiciona os ingredientes e a água na destilaria. Uma poção começa a borbulhar.");
                this.#ingredientesAdicionados = true;
                ingredientes.acaoOk = true; 
                this.ferramentas.set("pocao_magica", new PocaoMagica()); 
                this.#pocaoFeita = true;
                return true;
            }
            console.log("Os ingredientes já foram adicionados.");
            return false;
        }
        else if (objetoNome === "ritual_misterioso") {
            let ritual = objeto;
            if (!(ferramenta instanceof PocaoMagica)) {
                console.log(`A ferramenta '${ferramenta.nome}' não é adequada para o ritual.`);
                return false;
            }
            if (!this.#pocaoFeita) { 
                console.log("Você precisa de uma poção mágica para o ritual.");
                return false;
            }
            if (ritual.usar(ferramenta)) {
                console.log(`Ação realizada com sucesso! ${ritual.descricao}`);
                return true;
            }
            return false;
        }
        
        return super.usa(ferramentaNome, objetoNome);
    }
}