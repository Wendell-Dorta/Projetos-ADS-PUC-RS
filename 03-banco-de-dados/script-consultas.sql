REM   Script: script-consultas
REM   Script com consultas SQL sobre o banco de dados das construtoras

SELECT
    cpf,
    nome
FROM
    TRABALHADORES
WHERE
    salario > 2500.00;

SELECT
    T.nome,
    T.salario
FROM
    TRABALHADORES T
JOIN OBRAS O ON T.codigo_obra = O.codigo
JOIN CONSTRUTORAS C ON O.codigo_construtora = C.codigo
WHERE
    C.nome = 'Construtora Alfa'
ORDER BY
    T.nome ASC;

SELECT
    O.nome AS nome_obra,
    SUM(T.salario) AS folha_de_pagamento
FROM
    OBRAS O
JOIN TRABALHADORES T ON O.codigo = T.codigo_obra
GROUP BY
    O.codigo, O.nome -- Agrupa por código e nome para garantir unicidade
ORDER BY
    nome_obra;

SELECT
    E.codigo,
    E.nome
FROM
    EQUIPAMENTOS E
LEFT JOIN ALOCACAO A ON E.codigo = A.codigo_equipamento
WHERE
    A.codigo_equipamento IS NULL -- Se a junção não encontrar correspondência em ALOCACAO, o lado direito será nulo;

