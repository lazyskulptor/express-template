import ctx from "@/app-context";
import {
  MySqlContainer,
} from "testcontainers";
import {StartedMySqlContainer} from "testcontainers";

let startedContainer: StartedMySqlContainer;
beforeAll(async () => {
  startedContainer = await new MySqlContainer().start();
  console.debug(startedContainer.getHost());
  process.env.DB_HOST = startedContainer.getHost();
  process.env.DB_USERNAME = startedContainer.getUsername();
  process.env.DB_PASSWORD = startedContainer.getUserPassword();
  process.env.DB_DATABASE = startedContainer.getDatabase();
  process.env.DB_PORT = String(startedContainer.getPort());
}, 30 * 1000);

afterAll(async () => {
  await startedContainer.stop();
});
