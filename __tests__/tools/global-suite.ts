import { MySqlContainer, StartedMySqlContainer } from "testcontainers";
import { MikroORM } from "@mikro-orm/core";
import { migrate } from "@/migrations/utils";

let mysqlContainer: StartedMySqlContainer;
let orm: MikroORM;
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
  if (mysqlContainer)
    return await mysqlContainer.stop();
};

beforeAll(async () => {
  mysqlContainer = await startContainer();
  orm = await migrate();
}, 30 * 1000);

afterAll(async () => {
  await orm.close();
  await stopContainer();
});
