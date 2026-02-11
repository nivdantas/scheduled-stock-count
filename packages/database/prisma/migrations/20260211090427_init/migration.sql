-- CreateEnum
CREATE TYPE "StatusContagem" AS ENUM ('EM_ANDAMENTO', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "SituacaoItem" AS ENUM ('A_CONFERIR', 'CONFERIDO', 'FALTANTE_EXCEDENTE');

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "codigoSistema" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstoqueProduto" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidadeSistema" INTEGER NOT NULL,

    CONSTRAINT "EstoqueProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContagemEstoque" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataAgendada" TIMESTAMP(3) NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "status" "StatusContagem" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContagemEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemContagemEstoque" (
    "id" TEXT NOT NULL,
    "contagemEstoqueId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidadeSistema" INTEGER NOT NULL,
    "quantidadeContada" INTEGER,
    "situacao" "SituacaoItem" NOT NULL DEFAULT 'A_CONFERIR',
    "observacao" TEXT,

    CONSTRAINT "ItemContagemEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_codigoSistema_key" ON "Produto"("codigoSistema");

-- CreateIndex
CREATE UNIQUE INDEX "EstoqueProduto_produtoId_key" ON "EstoqueProduto"("produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "ContagemEstoque_codigo_key" ON "ContagemEstoque"("codigo");

-- AddForeignKey
ALTER TABLE "EstoqueProduto" ADD CONSTRAINT "EstoqueProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContagemEstoque" ADD CONSTRAINT "ContagemEstoque_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemContagemEstoque" ADD CONSTRAINT "ItemContagemEstoque_contagemEstoqueId_fkey" FOREIGN KEY ("contagemEstoqueId") REFERENCES "ContagemEstoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemContagemEstoque" ADD CONSTRAINT "ItemContagemEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
