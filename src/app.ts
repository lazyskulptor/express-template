import * as express from 'express';
import { ErrorRequestHandler } from "express";
import {urlencoded, json as jsonencoded} from 'body-parser';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import * as dotenv from "dotenv";
import { BadRequestException, NotFoundException } from '@/domain/exceptions';
import router from '@/router/user-router';
import * as process from "process";

const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env';
console.info('NODE RUN IN ENV ' + process.env.NODE_ENV);
dotenv.config({
  path: envFile
});
const app = express();

app.use(cors());
app.use(urlencoded({
  extended: true
}));
app.use(jsonencoded());
app.use(bodyParser.json());
app.use(router);

const errorHandler = (err, req, res, _next): ErrorRequestHandler => {
  const obj = {
    debug: true,
    code: 500,
    message: err.message,
    stack: err.stack,
    user: undefined,
  };
  if (process.env.NODE_ENV === 'production') {
    delete obj.debug;
    delete obj.stack;
  } else {
    obj.user = req.user;
  }

  if (err instanceof BadRequestException) {
    obj.code = 400;
    return res.status(200).json(obj);
  } else if (err instanceof NotFoundException) {
    obj.code = 404;
    return res.status(obj.code).json(obj);
  } else {
    console.error(err);
    return res.status(obj.code).json(obj);
  }
};
app.use(errorHandler);


export default app;