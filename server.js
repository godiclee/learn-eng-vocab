import express from 'express';
const app = express();

import cors from 'cors'
app.use(cors())

import dotenv from "dotenv-defaults"
dotenv.config();

import bodyParser from 'body-parser'
app.use(bodyParser.json());

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true,}).then((res) => console.log("mongo db connection created"));

const port = process.env.PORT || 80;
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

import loginRouter from './backend/routes/loginRouter.js';
import cardRouter from './backend/routes/cardRouter.js';
import progressRouter from './backend/routes/progressRouter.js';
import settingRouter from './backend/routes/settingRouter.js';


app.use('/api/login', loginRouter);
app.use('/api/card', cardRouter);
app.use('/api/progress', progressRouter);
app.use('/api/setting', settingRouter);

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}
/* "nodemon server.js --ext js --exec babel-node", */
/* "node server.js" */
