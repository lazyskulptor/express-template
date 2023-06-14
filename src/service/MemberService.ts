import Member from '@/domain/model/Member';
import MemberRepo from '@/service/MemberRepo';

export default class MemberService {
  constructor(private repo: MemberRepo) {
  }

  async persist (entity: Member) {
    return this.repo.persist(entity);
  }

  async deleteById (id: number) {
    this.repo.deleteById(id);
  };

  async findById(id: number) {
    return this.repo.findById(id);
  }
}
