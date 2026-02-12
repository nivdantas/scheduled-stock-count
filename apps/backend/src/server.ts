import express from "express";
import authRoutes from "./routes/auth";
import contagemRoutes from "./routes/contagens";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:3001"];

//Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
// Rotas
app.use(authRoutes);
app.use(contagemRoutes);

const PORT = 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Backend API: porta 3000"));
}

export default app;
