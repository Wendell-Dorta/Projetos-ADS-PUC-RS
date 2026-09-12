import {Ferramenta} from "./Basicas.js";
// Importa a classe base 'Ferramenta' do módulo local './Basicas.js'.

// Ferramenta com uso limitado a 1 vez
/**
 * @class PaEnferrujada
 * @augments Ferramenta
 * @description Uma Pá Enferrujada, que só pode ser usada uma única vez.
 */
export class PaEnferrujada extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "pa_enferrujada" e 1 uso.
     */
    constructor() {
        super("pa_enferrujada", 1);
    }
}

// Ferramenta com uso limitado a 2 vezes
/**
 * @class PanoUmedo
 * @augments Ferramenta
 * @description Um Pano Umedo, com dois usos antes de se esgotar.
 */
export class PanoUmedo extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "pano_umedo" e 2 usos.
     */
    constructor() {
        super("pano_umedo", 2);
    }
}

// Ferramenta com uso limitado a 3 vezes
/**
 * @class FosforosSecos
 * @augments Ferramenta
 * @description Fósforos Secos, com três usos antes de se esgotarem.
 */
export class FosforosSecos extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "fosforos_secos" e 3 usos.
     */
    constructor() {
        super("fosforos_secos", 3);
    }
}

// Ferramenta com uso limitado a 1 vez
/**
 * @class Bateria
 * @augments Ferramenta
 * @description Uma Bateria descartável, com apenas um uso.
 */
export class Bateria extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "bateria" e 1 uso.
     */
    constructor() {
        super("bateria", 1);
    }
}

// Ferramenta de uso ilimitado
/**
 * @class ChaveEnferrujada
 * @augments Ferramenta
 * @description Uma Chave Enferrujada, com usos ilimitados (padrão Ferramenta).
 */
export class ChaveEnferrujada extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "chave_enferrujada" e usos ilimitados (-1).
     */
    constructor() {
        super("chave_enferrujada"); // Omissão do segundo argumento assume usos ilimitados (-1)
    }
}

// Ferramenta de uso ilimitado
/**
 * @class ChavePequena
 * @augments Ferramenta
 * @description Uma Chave Pequena, com usos ilimitados.
 */
export class ChavePequena extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "chave_pequena" e usos ilimitados.
     */
    constructor() {
        super("chave_pequena");
    }
}

// Ferramenta com uso limitado a 5 vezes (energia da lanterna)
/**
 * @class LanternaCarregada
 * @augments Ferramenta
 * @description Uma Lanterna Carregada, representando uma fonte de luz com bateria limitada a 5 usos.
 */
export class LanternaCarregada extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "lanterna_carregada" e 5 usos.
     */
    constructor() {
        super("lanterna_carregada", 5);
    }
}

// Classe AmuletoAncestral declarada SOMENTE AQUI, como uma Ferramenta
/**
 * @class AmuletoAncestral
 * @augments Ferramenta
 * @description Um Amuleto Ancestral, uma ferramenta especial de uso ilimitado.
 */
export class AmuletoAncestral extends Ferramenta {
    /**
     * @constructor
     * @description Inicializa a ferramenta com o nome "amuleto_ancestral" e usos ilimitados.
     */
    constructor() {
        super("amuleto_ancestral");
    }
}

// --- FERRAMENTAS FALTANTES (Conforme UML/OCR) ---

/**
 * @class ChaveMisteriosa
 * @augments Ferramenta
 * @description Uma chave de uso ilimitado.
 */
export class ChaveMisteriosa extends Ferramenta {
    constructor() {
        super("chave_misteriosa");
    }
}

/**
 * @class RegadorAbencoado
 * @augments Ferramenta
 * @description Regador, uso ilimitado.
 */
export class RegadorAbencoado extends Ferramenta {
    constructor() {
        super("regador_abencoado");
    }
}

/**
 * @class PocaoMagica
 * @augments Ferramenta
 * @description Poção Mágica, uso limitado a 1 vez.
 */
export class PocaoMagica extends Ferramenta {
    constructor() {
        super("pocao_magica", 1);
    }
}

/**
 * @class BaldeAgua
 * @augments Ferramenta
 * @description Balde com Água, uso limitado a 1 vez (para encher a pia).
 */
export class BaldeAgua extends Ferramenta {
    constructor() {
        super("balde_de_agua", 1);
    }
}

/**
 * @class RoloBarbante
 * @augments Ferramenta
 * @description Rolo de Barbante, uso ilimitado para reparos.
 */
export class RoloBarbante extends Ferramenta {
    constructor() {
        super("rolo_de_barbante");
    }
}

/**
 * @class ChaveAntiga
 * @augments Ferramenta
 * @description Chave Antiga, uso ilimitado (para o portão trancado).
 */
export class ChaveAntiga extends Ferramenta {
    constructor() {
        super("chave_antiga");
    }
}