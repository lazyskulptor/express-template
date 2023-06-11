import ctx from "@/app-context";
import initOrm, { basicOption } from '@/repo/repo-context';
import { MySqlContainer, StartedMySqlContainer } from "testcontainers";
import fs from 'fs/promises';

let mysqlContainer: StartedMySqlContainer;
const startContainer = async () => {
  const { TESTCONTAINERS } = process.env;
  if (!TESTCONTAINERS || TESTCONTAINERS.toUpperCase() === 'FALSE')
    return;
  
  const container = await new MySqlContainer().start();
  console.debug(container.getHost());
  process.env.DB_HOST = container.getHost();
  process.env.DB_USERNAME = container.getUsername();
  process.env.DB_PASSWORD = container.getUserPassword();
  process.env.DB_DATABASE = container.getDatabase();
  process.env.DB_PORT = String(container.getPort());
  return container;
};

const stopContainer = async () => {
  if (!!mysqlContainer)
    return await mysqlContainer.stop();
}

const migrate = async () => {
  const { DB_TYPE } = process.env;
  const orm = await initOrm();
  const migrator = orm.getMigrator();

  if (DB_TYPE === 'sqlite') {
    // clean sqlite directory
    await fs.rm(basicOption.migrations.pathTs, { recursive: true });
    await fs.mkdir(basicOption.migrations.pathTs);
    await migrator.createInitialMigration();
  }
  await migrator.up();
}

beforeAll(async () => {
  mysqlContainer = await startContainer();
  await migrate();
}, 30 * 1000);

afterAll(async () => {
  await stopContainer();
});
