import initOrm from '@/repo/repo-context';
import Member from '@/domain/model/Member';
import { EntityManager, MikroORM, Reference } from '@mikro-orm/core';
import Authority from '@/domain/model/Authority';

describe('Persist bug', () => {
  let orm: MikroORM;
  let em: EntityManager;

  beforeAll(async () => {
    orm = await initOrm();
    em = orm.em.fork();
  });

  it('shows Wraping isn\'t work', async () => {
    const mem = consMember();
    const ref = new Reference(mem);
    em.persist(ref);
    em.flush();

    expect(mem.id).toBeNull();
  });

  it('tries to detach entity from persistence context', async () => {
    const mem = consMember();
    const ref = new Reference(mem);
    em.persist(ref);
    em.flush();

    Reference.unwrapReference(mem);
    mem.lastName = 'Foo'
    em.flush();

    const persisted = await em.findOne(Member, { id: mem.id });

    expect(persisted.lastName).not.toBe(mem.lastName);
  });


  it('tries by cloning', async () => {
    const mem1 = consMember();
    const mem2 = consMember();

    const auth = new Authority('member');
    mem2.authorities.add(auth);

    const cloned1 = cloneObj(mem1);
    console.debug(Object.getPrototypeOf(mem1) === Object.getPrototypeOf(cloned1)); // true
    em.persist(cloned1);
    await em.flush(); // It works

    console.debug(mem2);
    const cloned2 = cloneObj(mem2);
    console.debug(Object.getPrototypeOf(mem2) === Object.getPrototypeOf(cloned2)); // true
    console.debug(mem2 instanceof Member); // true
    console.debug(cloned2 instanceof Member); // true
    console.debug(cloned2);
    em.persist(cloned2);
    await em.flush(); // It errors

    console.debug(cloned1);
  });
});

const cloneObj = (obj) => Object.assign(Object.create(Object.getPrototypeOf(obj)), obj) as Member;


const consMember = () => {
  const member = new Member();
  member.username = 'username';
  member.password = 'password';
  member.firstName = 'firstName';
  member.lastName = 'lastName';
  return member;
};
