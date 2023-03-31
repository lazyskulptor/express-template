export const handler = (cb: (req, res) => Promise<void>) => (
  (rq, rs, next): Promise<void> => cb(rq, rs).catch(next)
);
