import 'module-alias/register';
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });
console.info('NODE RUN IN ENV ' + process.env.NODE_ENV);

import initApp from "@/app";
import { migrate } from '@/migrations/utils';
import { MikroORM } from '@mikro-orm/core';

const init = async (orm: MikroORM) => {
  (await initApp(orm)).listen(process.env.WEB_PORT, () => console.log(`listening ${process.env.WEB_PORT}`));
};

migrate().then(init);
