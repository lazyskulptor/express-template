import sequelize from '@/repo/sequelize-ctx';
import Member from "@/domain/model/Member";

describe('CRUD user from Database', () => {

  beforeAll(async () => {
    await sequelize.query(`CREATE TABLE member (id INTEGER, name TEXT)`);
    await sequelize.query(`CREATE TABLE authority (name TEXT)`);
    await sequelize.query(`CREATE TABLE member_auth_rel (memberId INTEGER, authorityName TEXT)`);
  });

  it('should work', async () => {

    console.debug('hello world');
    const repo = sequelize.getRepository(Member);
    const list = await repo.findAll();

    // const obj = new Member();
    // console.debug(obj);
    console.debug(Member.toString());
    console.debug(list);
  });
});
