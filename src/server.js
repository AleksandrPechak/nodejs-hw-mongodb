import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import productsRouter from "./routers/contacts.js";
import { errorHandler } from "./middlewares/error.Handlers.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(productsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log('\x1b[42m%s\x1b[0m', `Server is running on port ${PORT}`);
  });
};