import initOrm from '@/repo/repo-context';
import Member from '@/domain/model/Member';
import { MikroORM } from '@mikro-orm/core';

describe('CRUD user from Database', () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await initOrm();
  });

  it('should work', async () => {
    const em = orm.em.fork();
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    await em.persistAndFlush(mem);

    const list = await em.find(Member, {});

    expect(list.length).toBeGreaterThan(0);

    for (const m of list) {
      console.debug(m);
      expect(m).toBeInstanceOf(Member);
      expect(m.id).not.toBeNull();
    }
  });
});
