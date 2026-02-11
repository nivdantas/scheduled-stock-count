import { Router } from "express";
import { prisma } from "@repo/database";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "psecret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.funcionario.findUnique({
      where: { email },
      include: {
        contagens: {
          take: 3,
          orderBy: { criadoEm: "desc" },
        },
      },
    });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const senhaValida = await compare(password, user.password);
    if (!senhaValida)
      return res.status(401).json({ error: "Credenciais inválidas" });

    const token = sign({ id: user.id, nome: user.nome }, JWT_SECRET, {
      expiresIn: "1d",
    });
    let contagemAlvo = user.contagens.find((c) => c.status !== "FINALIZADA");
    if (!contagemAlvo && user.contagens.length > 0) {
      contagemAlvo = user.contagens[0];
    }

    const contagemAtivaId = contagemAlvo ? contagemAlvo.id : null;
    const { password: _, contagens, ...userSemSenha } = user;
	  res.cookie("stock_token", token, {
		  httpOnly: true,
		  secure: process.env.NODE_ENV === "production",
		  maxAge: 24 * 60 * 60 * 1000,
		  sameSite: "strict",
		  path: "/"
    })
    return res.json({ user: userSemSenha, contagemAtivaId });
  } catch (error) {
    return res.status(500).json({ error: "Erro no login" });
  }
});

export default router;
