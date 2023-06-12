import initOrm from '@/repo/repo-context';
import Member from '@/domain/model/Member';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import MemberService from '@/service/MemberService';
import MemberRepoImpl from '@/repo/impl/MemberRepoImpl';

describe('Meber CRUD', () => {
  let orm: MikroORM;
  let svc: MemberService;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await initOrm();
    em = orm.em.fork();
    svc = new MemberService(new MemberRepoImpl(em));
  });

  it('find entity', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    await em.persistAndFlush(mem);
    console.debug(mem);

    const persisted = await svc.findById(mem.id);

    console.debug(persisted);
    console.debug(persisted === mem);
    expect(persisted.name).toBe('Park');
  });
});
