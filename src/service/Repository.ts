import Page from "@/domain/spec/Page";
import Spec from "@/domain/spec/Spec";

export default interface Repository<T extends object, ID> {
  findOneBySpec: (spec: Spec<T>) => Promise<T>;

  findPageBySpec: (spec: Spec<T>, page?: Page<T>) => Promise<[Page<T>]>;

  persist: (entity: T) => T;

  deleteById: (id: ID) => void;

  flush: () => Promise<void>;
}
