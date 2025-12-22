import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'
import cors from 'cors'

const allowedOrigin = [
    'http://localhost:5173'
]


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
    origin:allowedOrigin
}))


 app.use(express.json())
app.use(cookieParser())

 app.use("/api/auth",authRoutes )

app.listen(PORT, ()=> console.log(`Server listen at http://localhost:${PORT}`));


// await db
//   .update(UserSessions)
//   .set({
//     refreshToken: newHashedRefreshToken,
//     lastUsedAt: new Date(),
//   })
//   .where(eq(UserSessions.id, sessionId));
