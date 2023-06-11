import 'module-alias/register';
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });
console.info('NODE RUN IN ENV ' + process.env.NODE_ENV);

import app from "@/app";
import { migrate } from '@/migrations/utils';

const init = (): void => {
  app.listen(process.env.WEB_PORT,()=>console.log(`listening ${process.env.WEB_PORT}`));
};

migrate().then(init);
