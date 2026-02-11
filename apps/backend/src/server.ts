import express from "express";
import authRoutes from "./routes/auth"
import contagemRoutes from "./routes/contagens"
import cors from "cors";

const app = express();

// Middlewares
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3001'];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
}));
app.use(express.json());

// Rotas
app.use(authRoutes);
app.use(contagemRoutes)

const PORT = 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Dev server on 3000'));
}

export default app;
