import Member from '@/domain/model/Member';
import EqualSpec from '@/domain/spec/EqualSpec';
import Page from '@/domain/spec/Page';
import Spec from '@/domain/spec/Spec';
import Repository from '@/service/Repository';

export default class MemberService {
  constructor(private repo: Repository<Member, number>) {
  }

  async persist (entity: Member) {
    const persisted = this.repo.persist(entity);
    await this.repo.flush();
    return persisted;
  }

  async deleteById (id: number) {
    this.repo.deleteById(id);
    await this.repo.flush();
  }

  async findById(id: number) {
    const spec = new Member();
    spec.id = id;
    return this.repo.findOneBySpec(new EqualSpec(spec));
  }

  async findPageBySpec(spec: Spec<Member>, page?: Page<Member>) {
    return this.repo.findPageBySpec(spec, page);
  }
}
