import Authority from '@/domain/model/Authority';
import Member from '@/domain/model/Member';
import EqualSpec from '@/domain/spec/EqualSpec';
import Page from '@/domain/spec/Page';
import Spec from '@/domain/spec/Spec';
import Repository from '@/service/Repository';

export default class MemberService {
  constructor(private repo: Repository<Member, number>,
              private authRepo: Repository<Authority, number>) {
  }

  async persist (entity: Member) {
    entity.authorities.set(await this.checkPreExistAuth(...entity.authorities.getItems()));
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

  private async checkPreExistAuth(...auths: Authority[]) {
    const cloned = auths.map(auth => auth.clone())
      .sort((l, r) => l.name.localeCompare(r.name));
    const notPersisted = cloned
      .filter(auth => auth.id === undefined && auth.name);
    const spec = notPersisted.length <= 0 ? undefined : notPersisted
      .map(auth => new EqualSpec(auth) as Spec<Authority>)
      .reduce((l, r) => l.or(r));
    const { list } = await this.authRepo.findPageBySpec(spec, Page.req({ limit: auths.length }));
    list.sort((l, r) => l.name.localeCompare(r.name));

    let i = 0;
    for (const auth of notPersisted) {
      for (; i < list.length; i++) {
        if (auth.name === list[i].name) {
          auth.id = list[i].id;
        } else if (auth.name > list[i].name) {
          break;
        }
      }
    }
    return cloned;
  }
}
