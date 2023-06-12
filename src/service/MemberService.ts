import MemberRepo from '@/service/MemberRepo';

export default class MemberService {
  constructor(private repo: MemberRepo) {
  }

  async findById(id: number) {
    return this.repo.findById(id);
  }
}
