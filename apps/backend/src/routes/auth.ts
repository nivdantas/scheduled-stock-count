import { Router } from "express";
import { prisma } from "@repo/database";
import { compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

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

    if (!user) return res.status(401).json({ error: "Usuário ou credenciais inválida." });

    const senhaValida = await compare(password, user.password);
    if (!senhaValida)
      return res.status(401).json({ error: "Usuário ou credencial inválida." });

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

router.post("/logout", (req, res) => {
  res.clearCookie("stock_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });
  return res.json({ message: "Deslogado com sucesso" });
});

router.get("/verify", async (req, res) => {
  const token = req.cookies.stock_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.funcionario.findUnique({
      where: { id: decoded.id },
      include: {
        contagens: {
          take: 3,
          orderBy: { criadoEm: "desc" },
        },
      },
    });

    if (!user) return res.status(401).json({ authenticated: false });

    let contagemAlvo = user.contagens.find((c) => c.status !== "FINALIZADA");

    if (!contagemAlvo && user.contagens.length > 0) {
      contagemAlvo = user.contagens[0];
    }

    const contagemAtivaId = contagemAlvo ? contagemAlvo.id : null;

    const { password: _, contagens, ...userSemSenha } = user;

    return res.json({
      authenticated: true,
      user: userSemSenha,
      contagemAtivaId
    });

  } catch (error) {

    return res.status(401).json({ authenticated: false });

  }
});


export default router;
