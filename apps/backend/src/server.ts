import express from "express";
import cors from "cors";
import { prisma } from "@repo/database";
import { EnumSituacaoItemFieldUpdateOperationsInput } from "@repo/database/generated/prisma/internal/prismaNamespace";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/contagens/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contagem = await prisma.contagemEstoque.findUnique({
      where: { id },
      include: {
        responsavel: true,
        itens: {
          include: { produto: true },
          orderBy: { produto: { nome: "asc" } },
        },
      },
    });

    if (!contagem) {
      return res.status(404).json({ error: "Contagem não encontrada" });
    }

    return res.json(contagem);
  } catch (error) {
    console.error("Erro ao buscar contagem", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/contagens", async (req, res) => {
  const { codigo, responsavelId } = req.body;

  if (!codigo || !responsavelId) {
    return res
      .status(400)
      .json({ error: "Campos código e responsavelId são obrigatórios" });
  }

  try {
    const produtos = await prisma.produto.findMany({
      include: { estoque: true },
    });

    if (produtos.length === 0) {
      return res
        .status(400)
        .json({
          error: "Não há produtos cadastrados para iniciar uma contagem",
        });
    }

    const novaContagem = await prisma.contagemEstoque.create({
      data: {
        codigo,
        dataAgendada: new Date(),
        responsavelId,
        status: "EM_ANDAMENTO",
        itens: {
          create: produtos.map((p) => ({
            produtoId: p.id,
            quantidadeSistema: p.estoque?.quantidadeSistema ?? 0,
            situacao: "A_CONFERIR",
            quantidadeContada: null,
          })),
        },
      },
    });
    return res.status(201).json(novaContagem);
  } catch (error) {
    console.error("Erro ao criar contagem", error);
    return res.status(500).json({ error: "Falha ao criar contagem" });
  }
});

app.patch("/itens-contagem/:id", async (req, res) => {
  const { id } = req.params;
  const { quantidadeContada, observacao } = req.body;

  try {
    const itemAtual = await prisma.itemContagemEstoque.findUnique({
      where: { id },
      include: {
        contagem: { select: { status: true } },
      },
    });

    if (!itemAtual)
      return res.status(404).json({ error: "Item não encontrado" });

    if (itemAtual.contagem.status === "FINALIZADA") {
      return res.status(403).json({
        error: "Ação bloqueada: Esta contagem já foi finalizada.",
      });
    }

    let novaSituacao = "A_CONFERIR";

    if (quantidadeContada !== null && quantidadeContada !== undefined) {
      const qtdNumerica = Number(quantidadeContada);

      if (qtdNumerica === itemAtual.quantidadeSistema) {
        novaSituacao = "CONFERIDO";
      } else {
        novaSituacao = "FALTANTE_EXCEDENTE";
      }
    }

    const itemAtualizado = await prisma.itemContagemEstoque.update({
      where: { id },
      data: {
        quantidadeContada:
          quantidadeContada === null ? null : Number(quantidadeContada),
        observacao,
        situacao: novaSituacao as EnumSituacaoItemFieldUpdateOperationsInput,
      },
      include: {
        produto: true,
      },
    });

    return res.json(itemAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar item:", error);
    return res.status(500).json({ error: "Falha ao atualizar item" });
  }
});

app.patch("/contagens/:id", async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  try {
    const contagem = await prisma.contagemEstoque.update({
      where: { id },
      data: {
        status: status,
      },
    });

    return res.json(contagem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

app.patch("/contagens/:id/finalizar", async (req, res) => {
  const { id } = req.params;
  try {
    const check = await prisma.contagemEstoque.findUnique({ where: { id } });
    if (check?.status === "FINALIZADA") {
      return res.status(400).json({ error: "Contagem já finalizada." });
    }
    const contagem = await prisma.contagemEstoque.update({
      where: { id },
      data: { status: "FINALIZADA" },
    });
    return res.json(contagem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao finalizar" });
  }
});

app.patch("/itens-contagem/:id/reset", async (req, res) => {
  const { id } = req.params;

  try {
    const itemExistente = await prisma.itemContagemEstoque.findUnique({
      where: { id },
      include: { contagem: true },
    });

    if (!itemExistente) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    if (itemExistente.contagem.status === "FINALIZADA") {
      return res.status(400).json({ error: "Contagem finalizada." });
    }
    const item = await prisma.itemContagemEstoque.update({
      where: { id },
      data: {
        quantidadeContada: null,
        observacao: null,
        situacao: "A_CONFERIR",
      },
      include: { produto: true },
    });

    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao resetar item" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000!");
});
