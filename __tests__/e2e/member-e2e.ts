import initApp from "@/app";
import initOrm from "@/repo/repo-context";
import supertest from "supertest";
import { repoContext } from '@/repo/repo-context';
import Member from "@/domain/model/Member";
import { EntityManager } from "@mikro-orm/core";

const ENDPOINT = '/members';

describe('test member path', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let em: EntityManager;

  beforeAll(async () => {
    const orm = await initOrm();
    em = orm.em.fork();
    const app = await initApp(orm);
    request = supertest(app);
  });

  it('should get Member info', async () => {
    const memRepo = repoContext(em).memRepo;
    const mem = new Member();
    mem.username = 'Park';
    const inserted = memRepo.persist(mem);
    await em.flush();

    await request.get(ENDPOINT + `/${inserted.id}`)
      .expect(200)
      .then(res => {
        expect(res.body.name).toBe(mem.username);
      });
  });
});
