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
    svc = new MemberService(
      new RepoTemplate<Member, number>(em, Member),
      new RepoTemplate<Authority, number>(em, Authority)
    );
  });

  it('update case adding to collection', async () => {
    const mem1 = genMember();
    const mem2 = genMember();

    const auth = new Authority('member1');
    mem2.authorities.add(auth);

    const inserted = await svc.persist(mem1);
    await svc.persist(mem2);

    mem1.username = 'Lee';
    mem1.id = inserted.id;
    mem1.authorities.add(auth);
    await svc.persist(mem1);
    em.clear();

    const persisted = await svc.findById(inserted.id);
    expect(persisted.username).toBe('Lee');
    expect(persisted.authorities.getItems()[0].name).toBe(auth.name);
    expect(persisted.createdAt.getTime()).toBeLessThan(persisted.updatedAt.getTime());
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
