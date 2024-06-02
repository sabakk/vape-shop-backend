import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { routes } from './routes';
import { AppDataSource } from './data-source';
import { errorHandler } from './utility/errorHandler';

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        credentials: true,
        origin: [`http://localhost:${process.env.CLIENT_PORT}`],
      })
    );

    routes(app);
    app.use(errorHandler);

    app.listen(8000, () => {
      console.log(`listening to port ${process.env.SERVER_PORT}`);
    });
  })
  .catch((error) => console.log(error));
