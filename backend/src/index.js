import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { app, server } from './lib/socket.js';
dotenv.config();

const port = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://chat-app-five-umber-58.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/auth', authRoutes);

app.use('/api/messages', messageRoutes);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));

//   app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
//   });
// }

server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
  connectDb();
});
