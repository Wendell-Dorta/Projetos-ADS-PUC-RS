-- CreateTable
CREATE TABLE "clientes" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "planos" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "custoMensal" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codPlano" INTEGER NOT NULL,
    "codCli" INTEGER NOT NULL,
    "inicioFidelidade" DATETIME NOT NULL,
    "fimFidelidade" DATETIME NOT NULL,
    "dataUltimoPagamento" DATETIME NOT NULL,
    "custoFinal" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    CONSTRAINT "assinaturas_codCli_fkey" FOREIGN KEY ("codCli") REFERENCES "clientes" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assinaturas_codPlano_fkey" FOREIGN KEY ("codPlano") REFERENCES "planos" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);
