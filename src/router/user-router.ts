import * as express from "express";
import { handler } from "@/router/utils";

const router = express.Router();


router.get('/', handler(async (req, res) => {
  res.send('hello world!');
}));

router.get('/debug', handler(async (req, res) => {
  res.json({
    headers: req.headers,
    method: req.method,
    path: req.path,
    queries: req.query,
    body: req.body,
    params: req.params,
  });
}));


export default router;
