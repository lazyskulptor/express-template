import initApp from "@/app";
import initOrm from "@/repo/repo-context";
import supertest from "supertest";

const ENDPOINT = '/';

describe('test root path', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const app = await initApp(await initOrm());
    request = supertest(app);
  });

  it('should be OK', async () => {
    await request.get(ENDPOINT)
      .expect(200);
  });
});
