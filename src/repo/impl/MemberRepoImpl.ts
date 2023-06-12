import Member from '@/domain/model/Member';
import MemberRepo from '@/service/MemberRepo';
import { EntityManager } from '@mikro-orm/core';

export default class MemberRepoImpl implements MemberRepo {
  constructor(private em: EntityManager) {
  }

  async findById (id: number) {
    return this.em.findOne(Member, { id });
  };
}
