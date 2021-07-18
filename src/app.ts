import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import expressPinoLogger from 'express-pino-logger';
import http from 'http';
import db from './config/db';
import { logger } from './logger/logger';
import messageRoutes from './routes/messageRoutes';
import authRoutes from './routes/userRoutes';

const configureWebSockets = require('./socket');

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(expressPinoLogger({ logger: logger }));

app.use('/webhook', messageRoutes);
app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Welcome to Server' });
});

const server = http.createServer(app);

configureWebSockets(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  db();
  logger.info(`Server Listening on Port ${PORT}`);
});
