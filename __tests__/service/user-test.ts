import initOrm from '@/repo/repo-context';
import Member from '@/domain/model/Member';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import MemberService from '@/service/MemberService';
import RepoTemplate from '@/repo/impl/RepoTemplate';
import Authority from '@/domain/model/Authority';

describe('Meber CRUD', () => {
  let orm: MikroORM;
  let svc: MemberService;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await initOrm();
    em = orm.em.fork();
    svc = new MemberService(
      new RepoTemplate<Member, number>(em, Member),
      new RepoTemplate<Authority, number>(em, Authority)
    );
  });

  it('successes to insert', async () => {
    const mem = genMember();

    const persisted = await svc.persist(mem);

    expect(mem.id).toBeUndefined();
    expect(persisted.id).not.toBeNull();
  });

  it('find', async () => {
    const mem = genMember();
    const auth = new Authority('admin');
    mem.authorities.add(auth);

    const inserted = await svc.persist(mem);
    em.clear();

    const persisted = await svc.findById(inserted.id);

    expect(persisted.username).toBe('username');
    expect(persisted.authorities.getItems()[0].name).toBe(auth.name);
    expect(persisted.createdAt).toBe(persisted.createdAt);
  });

  it('delete', async () => {
    const mem = genMember();

    const inserted = await svc.persist(mem);
    await svc.deleteById(inserted.id);

    const persisted = await svc.findById(inserted.id);
    expect(persisted).toBeNull();
  });
});


export const genMember = () => {
  const member = new Member();
  member.username = 'username';
  member.password = 'password';
  member.firstName = 'firstName';
  member.lastName = 'lastName';
  return member;
};
