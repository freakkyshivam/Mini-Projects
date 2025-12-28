import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.route.js'
import cors from 'cors'
import http from 'node:http'

const allowedOrigin = [
    'http://localhost:5173',
    'https://otpbasedauth.vercel.app'
]

const app = express();
const PORT = process.env.PORT ?? 3000;
const server = http.createServer(app)

 
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

app.use(cors({
    origin: allowedOrigin,
    credentials: true,             
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes)
 
app.get("/health", (req, res) => {
  res.send("OK");
});

server.listen(PORT, () => console.log(`🚀 Server listen at http://localhost:${PORT}`));