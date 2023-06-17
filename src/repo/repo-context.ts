import { Configuration, EntityManager, MikroORM, Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import Repository from '@/service/Repository';
import Member from '@/domain/model/Member';
import RepoTemplate from './impl/RepoTemplate';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_TYPE } = process.env;
const isPool = process.env.NODE_ENV === 'production' || process.env.NODE_ENV !== 'test';

export const basicOption: Options<MySqlDriver & SqliteDriver> = {
  // debug: true,
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
    console.debug('INIT ORM');
    orm = DB_TYPE === 'sqlite'
      ? await MikroORM.init<SqliteDriver>(basicOption)
      : await MikroORM.init<MySqlDriver>(basicOption);
  }

  return orm;
};

type RepoContext = {
  memRepo: Repository<Member, number>;
};

const ctx = {} as RepoContext;

/**
 * to Use context function Orm must be called and orm instance must be not null
 * initOrm is called in index.ts to boot service or global-suite.ts to test
 */
export const repoContext = (em?: EntityManager) => {
  // ctx.memRepo = ctx.memRepo ?? new MemberRepoImpl(em ?? orm.em);
  ctx.memRepo = ctx.memRepo ?? new RepoTemplate<Member, number>(em ?? orm.em, Member);
  return ctx;
};

export default initOrm;
