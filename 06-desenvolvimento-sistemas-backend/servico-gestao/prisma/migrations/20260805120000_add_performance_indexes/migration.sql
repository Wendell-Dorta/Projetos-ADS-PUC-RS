-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE INDEX "assinaturas_codCli_idx" ON "assinaturas"("codCli");

-- CreateIndex
CREATE INDEX "assinaturas_codPlano_idx" ON "assinaturas"("codPlano");

-- CreateIndex
CREATE INDEX "assinaturas_dataUltimoPagamento_idx" ON "assinaturas"("dataUltimoPagamento");
