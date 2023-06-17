import initOrm from '@/repo/repo-context';
import Member from '@/domain/model/Member';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import MemberService from '@/service/MemberService';
import RepoTemplate from '@/repo/impl/RepoTemplate';
import Authority from '@/domain/model/Authority';

describe('Update Meber', () => {
  let orm: MikroORM;
  let svc: MemberService;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await initOrm();
    em = orm.em.fork();
    svc = new MemberService(new RepoTemplate<Member, Number>(em, Member));
  });

  it('update case adding to collection', async () => {
    const mem1 = genMember();
    const mem2 = genMember();

    const auth = new Authority('member');
    mem2.authorities.add(auth);

    const inserted = await svc.persist(mem1);
    await svc.persist(mem2);

    mem1.username = 'Lee';
    mem1.id = inserted.id;
    mem1.authorities.add(auth);
    await svc.persist(mem1);

    const persisted = await svc.findById(inserted.id);
    expect(persisted.username).toBe('Lee');
    expect(persisted.authorities.getItems()[0].name).toBe(auth.name);
    expect(persisted.createdAt.getTime()).toBeLessThan(persisted.updatedAt.getTime());
  });

  it('update case overwriting collection with persisted one', async () => {
    const mem1 = genMember();
    const mem2 = genMember();

    const auth = new Authority('member');
    mem2.authorities.add(auth);

    const inserted = await svc.persist(mem1);
    const persistedMem2 = await svc.persist(mem2);

    mem1.id = inserted.id;
    mem1.authorities = persistedMem2.authorities;
    await svc.persist(mem1);

    const persisted = await svc.findById(inserted.id);
    expect(persisted.authorities.getItems()[0].name).toBe(auth.name);
    expect(persisted.createdAt.getTime()).toBeLessThan(persisted.updatedAt.getTime());
  });

  it('update case overwriting collection with not persisted one', async () => {
    const mem1 = genMember();
    const mem2 = genMember();

    const auth = new Authority('member');
    mem2.authorities.add(auth);

    const inserted = await svc.persist(mem1);

    mem1.id = inserted.id;
    mem1.authorities = mem2.authorities;
    await svc.persist(mem1);

    const persisted = await svc.findById(inserted.id);
    expect(persisted.authorities.getItems()[0].name).toBe(auth.name);
  });
});

const genMember = () => {
  const member = new Member();
  member.username = 'username';
  member.password = 'password';
  member.firstName = 'firstName';
  member.lastName = 'lastName';
  return member;
};
