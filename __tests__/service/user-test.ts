import initOrm from '@/repo/repo-context';
import Member from '@/domain/model/Member';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import MemberService from '@/service/MemberService';
import RepoTemplate from '@/repo/impl/RepoTemplate';

describe('Meber CRUD', () => {
  let orm: MikroORM;
  let svc: MemberService;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await initOrm();
    em = orm.em.fork();
    svc = new MemberService(new RepoTemplate<Member, Number>(em, Member));
  });

  it('successes to insert', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    const persisted = await svc.persist(mem);
    await em.flush();

    expect(mem.id).toBeUndefined();
    expect(persisted.id).not.toBeNull();
  });

  it('find', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    const inserted = await svc.persist(mem);
    await em.flush();

    const persisted = await svc.findById(inserted.id);

    expect(persisted.name).toBe('Park');
  });

  it('update', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    const inserted = await svc.persist(mem);
    await em.flush();
    mem.name = 'Lee';
    mem.id = inserted.id;
    await svc.persist(mem);
    await em.flush();

    const persisted = await svc.findById(inserted.id);

    expect(persisted.name).toBe('Lee');
  });

  it('delete', async () => {
    const mem = new Member();
    mem.name = 'Park';
    mem.comment = 'test insertion';

    const inserted = await svc.persist(mem);
    await em.flush();
    await svc.deleteById(inserted.id);
    await em.flush();

    const persisted = await svc.findById(inserted.id);
    expect(persisted).toBeNull();
  });
});
