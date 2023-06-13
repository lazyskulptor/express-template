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

  it('successes to insert', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    await svc.persist(mem);
    await em.flush();

    expect(mem.id).not.toBeNull();
  });

  it('fails to insert', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    await svc.persist(mem);

    expect(mem.id).toBeNull();
  });

  it('find', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    await svc.persist(mem);
    await em.flush();

    const persisted = await svc.findById(mem.id);

    expect(persisted.name).toBe('Park');
  });

  it('update', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    const inserted = svc.persist(mem);
    await em.flush();
    mem.name = 'Lee';
    mem.id = inserted.id;
    svc.persist(mem);
    await em.flush();

    const persisted = await svc.findById(inserted.id);

    console.debug(persisted);
    expect(persisted.name).toBe('Lee');
  });

  it('delete', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    await svc.persist(mem);
    await em.flush();
    await svc.deleteById(mem.id);
    await em.flush();

    const persisted = await svc.findById(mem.id);
    expect(persisted).toBeUndefined();
  });
});
