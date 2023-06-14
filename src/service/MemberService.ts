import Member from '@/domain/model/Member';
import Repository from './Repository';

export default class MemberService {
  constructor(private repo: Repository<Member, Number>) {
  }

  async persist (entity: Member) {
    const persisted = this.repo.persist(entity);
    await this.repo.flush();
    return persisted;
  }

  async deleteById (id: number) {
    this.repo.deleteById(id);
    await this.repo.flush();
  };

  async findById(id: number) {
    return this.repo.findById(id);
  }
}
