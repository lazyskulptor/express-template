import Member from "@/domain/model/Member";

export default interface MemberRepo {
  findById: (id: number) => Promise<Member>;

  persist: (entity: Member) => Member;

  deleteById: (id: number) => void;
}
