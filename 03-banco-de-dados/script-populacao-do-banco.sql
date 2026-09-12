REM   Script: script-populacao-do-banco
REM   Script DML para população das tabelas

DECLARE
    -- Variáveis para armazenar os IDs gerados
    v_construtora_alfa_id   NUMBER;
    v_construtora_wendell_id NUMBER;

    v_cat_veiculos_id       NUMBER;
    v_cat_ferramentas_id    NUMBER;
    v_cat_andaimes_id       NUMBER;
    v_cat_seguranca_id      NUMBER;

    v_equip_retro_id        NUMBER;
    v_equip_betoneira_id    NUMBER;
    v_equip_andaime_id      NUMBER;
    v_equip_cinto_id        NUMBER;
    v_equip_caminhao_id     NUMBER;
    v_equip_martelete_id    NUMBER;

    v_obra_lagos_id         NUMBER;
    v_obra_central_id       NUMBER;
    v_obra_flores_id        NUMBER;
    v_obra_delta_id         NUMBER;

BEGIN
    -- ======================================================
    -- PARTE 1: Dados da Construtora ALFA
    -- ======================================================

    -- 1.1 Inserindo Construtoras e capturando seus IDs
    INSERT INTO CONSTRUTORAS (nome, nome_fantasia, email)
    VALUES ('Construtora Alfa', 'Alfa Construções', 'contato@alfa.com')
    RETURNING codigo INTO v_construtora_alfa_id;

    -- 1.2 Inserindo os telefones da Construtora Alfa usando o ID capturado
    INSERT INTO TELEFONES (codigo_construtora, numero) VALUES (v_construtora_alfa_id, '5133334444');
    INSERT INTO TELEFONES (codigo_construtora, numero) VALUES (v_construtora_alfa_id, '5199998888');

    -- 1.3 Inserindo Categorias e capturando seus IDs
    INSERT INTO CATEGORIAS (descricao) VALUES ('Veículos Pesados') RETURNING codigo INTO v_cat_veiculos_id;
    INSERT INTO CATEGORIAS (descricao) VALUES ('Ferramentas Elétricas') RETURNING codigo INTO v_cat_ferramentas_id;
    INSERT INTO CATEGORIAS (descricao) VALUES ('Andaimes e Estruturas') RETURNING codigo INTO v_cat_andaimes_id;
    INSERT INTO CATEGORIAS (descricao) VALUES ('Equipamentos de Segurança') RETURNING codigo INTO v_cat_seguranca_id;

    -- 1.4 Inserindo Equipamentos e capturando seus IDs
    INSERT INTO EQUIPAMENTOS (nome, valor_uso_diario, codigo_categoria) VALUES ('Retroescavadeira', 850.00, v_cat_veiculos_id) RETURNING codigo INTO v_equip_retro_id;
    INSERT INTO EQUIPAMENTOS (nome, valor_uso_diario, codigo_categoria) VALUES ('Betoneira 500L', 150.50, v_cat_ferramentas_id) RETURNING codigo INTO v_equip_betoneira_id;
    INSERT INTO EQUIPAMENTOS (nome, valor_uso_diario, codigo_categoria) VALUES ('Estrutura de Andaime (m²)', 25.00, v_cat_andaimes_id) RETURNING codigo INTO v_equip_andaime_id;
    INSERT INTO EQUIPAMENTOS (nome, valor_uso_diario, codigo_categoria) VALUES ('Cinto de Segurança', 15.00, v_cat_seguranca_id) RETURNING codigo INTO v_equip_cinto_id;
    INSERT INTO EQUIPAMENTOS (nome, valor_uso_diario, codigo_categoria) VALUES ('Caminhão Basculante', 1200.00, v_cat_veiculos_id) RETURNING codigo INTO v_equip_caminhao_id;
    INSERT INTO EQUIPAMENTOS (nome, valor_uso_diario, codigo_categoria) VALUES ('Martelete Rompedor', 120.00, v_cat_ferramentas_id) RETURNING codigo INTO v_equip_martelete_id;

    -- 1.5 Inserindo Obras e capturando seus IDs
    INSERT INTO OBRAS (nome, logradouro, numero, complemento, codigo_construtora)
    VALUES ('Condomínio Lagos', 'Avenida das Garças', '1200', 'Fase 2', v_construtora_alfa_id)
    RETURNING codigo INTO v_obra_lagos_id;

    INSERT INTO OBRAS (nome, logradouro, numero, complemento, codigo_construtora)
    VALUES ('Edifício Central', 'Rua Sete de Setembro', '550', NULL, v_construtora_alfa_id)
    RETURNING codigo INTO v_obra_central_id;

    -- 1.6 Inserindo Trabalhadores usando os IDs de obra capturados
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('11122233344', 'João da Silva', 3200.00, v_obra_lagos_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('22233344455', 'Pedro Martins', 2400.00, v_obra_lagos_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('33344455566', 'Carlos Ferreira', 2800.00, v_obra_lagos_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('44455566677', 'Ana Pereira', 4500.00, v_obra_central_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('55566677788', 'Maria Oliveira', 2100.00, v_obra_central_id);

    -- 1.7 Alocando Equipamentos usando os IDs capturados
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_lagos_id, v_equip_retro_id, TO_DATE('2022-03-01', 'YYYY-MM-DD'), TO_DATE('2022-03-31', 'YYYY-MM-DD'));
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_lagos_id, v_equip_andaime_id, TO_DATE('2022-03-15', 'YYYY-MM-DD'), TO_DATE('2022-04-15', 'YYYY-MM-DD'));
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_lagos_id, v_equip_betoneira_id, TO_DATE('2022-02-10', 'YYYY-MM-DD'), TO_DATE('2022-03-10', 'YYYY-MM-DD'));

    -- ======================================================
    -- PARTE 2: Dados da Nova Construtora (Com meu nome)
    -- ======================================================

    -- 2.1 Inserindo a sua construtora e capturando o ID
    INSERT INTO CONSTRUTORAS (nome, nome_fantasia, email)
    VALUES ('Wendell Dorta', NULL, NULL)
    RETURNING codigo INTO v_construtora_wendell_id;

    -- 2.2 Inserindo as 2 novas obras e capturando seus IDs
    INSERT INTO OBRAS (nome, logradouro, numero, complemento, codigo_construtora)
    VALUES ('Residencial das Flores', 'Rua das Orquídeas', '300', NULL, v_construtora_wendell_id)
    RETURNING codigo INTO v_obra_flores_id;

    INSERT INTO OBRAS (nome, logradouro, numero, complemento, codigo_construtora)
    VALUES ('Torre Empresarial Delta', 'Avenida Principal', '1500', '10º Andar', v_construtora_wendell_id)
    RETURNING codigo INTO v_obra_delta_id;

    -- 2.3 Inserindo 10 novos funcionários (5 para cada obra)
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90190190101', 'Ricardo Souza', 2600.00, v_obra_flores_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90290290202', 'Fernanda Costa', 3100.00, v_obra_flores_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90390390303', 'Bruno Alves', 2200.00, v_obra_flores_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90490490404', 'Juliana Lima', 2900.00, v_obra_flores_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90590590505', 'Márcio Ribeiro', 2450.00, v_obra_flores_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90690690606', 'Vanessa Gomes', 5200.00, v_obra_delta_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90790790707', 'Lucas Azevedo', 4800.00, v_obra_delta_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90890890808', 'Patrícia Rocha', 3500.00, v_obra_delta_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('90990990909', 'Daniel Moraes', 3300.00, v_obra_delta_id);
    INSERT INTO TRABALHADORES (cpf, nome, salario, codigo_obra) VALUES ('91091091010', 'Camila Santos', 3400.00, v_obra_delta_id);

    -- 2.4 Alocando pelo menos 4 equipamentos à primeira obra criada
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_flores_id, v_equip_retro_id, TO_DATE('2023-10-01', 'YYYY-MM-DD'), TO_DATE('2023-12-31', 'YYYY-MM-DD'));
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_flores_id, v_equip_betoneira_id, TO_DATE('2023-10-01', 'YYYY-MM-DD'), TO_DATE('2023-11-30', 'YYYY-MM-DD'));
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_flores_id, v_equip_andaime_id, TO_DATE('2023-10-15', 'YYYY-MM-DD'), TO_DATE('2024-01-15', 'YYYY-MM-DD'));
    INSERT INTO ALOCACAO (codigo_obra, codigo_equipamento, data_inicio, data_termino)
    VALUES (v_obra_flores_id, v_equip_cinto_id, TO_DATE('2023-10-01', 'YYYY-MM-DD'), TO_DATE('2024-02-28', 'YYYY-MM-DD'));

    -- Confirma todas as transações do bloco
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Todos os dados foram inseridos com sucesso!');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;
/

