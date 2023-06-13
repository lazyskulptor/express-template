import { Request, Response, NextFunction } from 'express';

export const handler = (cb: (req: Request, res: Response) => Promise<void>) => (
  (rq: Request, rs: Response, next: NextFunction): Promise<void> => cb(rq, rs).catch(next)
);
