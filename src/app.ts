import express from 'express';
import { ErrorRequestHandler } from "express";
import {urlencoded, json as jsonencoded} from 'body-parser';
import bodyParser from 'body-parser';
import cors from "cors";
import { BadRequestException, NotFoundException } from '@/domain/exceptions';
import router from '@/router/user-router';
import { RequestContext } from '@mikro-orm/core';
import initOrm from '@/repo/repo-context';

const app = express();

app.use(cors());
app.use(urlencoded({
  extended: true
}));
app.use(jsonencoded());
app.use(bodyParser.json());
app.use(async (_req, _res, next) => RequestContext.create((await initOrm()).em, next));
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
