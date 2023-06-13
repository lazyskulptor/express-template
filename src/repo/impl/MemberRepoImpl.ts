import Member from '@/domain/model/Member';
import MemberRepo from '@/service/MemberRepo';
import { EntityManager, Reference, wrap, WrappedEntity } from '@mikro-orm/core';

export default class MemberRepoImpl implements MemberRepo {
  constructor(private em: EntityManager) {}

  persist (entity: Member) {
    const cloned = Object.assign(Object.create(Object.getPrototypeOf(entity)), entity) as Member;

    if (!cloned.id) {
      this.em.persist(cloned);
      return cloned;
    }
    // console.debug(this.em.getMetadata().get(Member.name).primaryKeys)
    const ref = this.em.getReference(Member, cloned.id);

    wrap(ref).assign(cloned);
    return ref;
  }

  deleteById (id: number) {
    const mem = this.em.getReference(Member, id);
    this.em.remove(mem);
  };

  async findById (id: number) {
    return await this.em.findOne(Member, { id });
  };
}