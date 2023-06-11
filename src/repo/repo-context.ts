import { Configuration, MikroORM, Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_TYPE } = process.env;
const isPool = process.env.NODE_ENV === 'production' || process.env.NODE_ENV !== 'test';

export const basicOption: Options<MySqlDriver & SqliteDriver> = {
  metadataProvider: TsMorphMetadataProvider,
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  dbName: DB_DATABASE,
  port: isNaN(Number(DB_PORT)) ? 3306 : Number(DB_PORT),
  entities: ['./dist/domain/model'],
  entitiesTs: ['./src/domain/model'],
  migrations: {
    path: `dist/migrations/${DB_TYPE}`,
    pathTs: `src/migrations/${DB_TYPE}`,
  },
  type: DB_TYPE as keyof typeof Configuration.PLATFORMS,
};

if (isPool) {
  basicOption.pool = {
    max: 10,
    min: 5,
    idleTimeoutMillis: 10000,
    acquireTimeoutMillis: 30000,
  };
}

let orm: MikroORM<MySqlDriver | SqliteDriver>;

const initOrm = async () => {
  if (!orm) {
    orm = DB_TYPE === 'sqlite'
      ? await MikroORM.init<SqliteDriver>(basicOption)
      : await MikroORM.init<MySqlDriver>(basicOption);
  }

  return orm;
}


export default initOrm;
