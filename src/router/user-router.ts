import express from "express";
import { handler } from "@/router/utils";
import ctx from '@/app-context';

const router = express.Router();


router.get('/', handler(async (req, res) => {
  res.send('hello world!');
}));

router.get('/members/:id', handler(async (req, res) => {
  const member = await ctx().memSvc.findById(Number(req.params.id));
  res.json(member);
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
