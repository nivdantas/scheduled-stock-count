import express from "express";
import authRoutes from "./routes/auth"
import contagemRoutes from "./routes/contagens"
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use(authRoutes);
app.use(contagemRoutes)

const PORT = 3000;
app.listen(3000, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
