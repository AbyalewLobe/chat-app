import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/massage', messageRoutes);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
const port = process.env.PORT;
app.listen(5001, () => {
  console.log(`The server is runing on port ${port}`);
  connectDb();
});
