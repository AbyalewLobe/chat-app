import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();

// ✅ Set CORS BEFORE defining routes
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Define routes after middleware
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
  connectDb();
});
