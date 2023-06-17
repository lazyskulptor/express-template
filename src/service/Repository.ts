export default interface Repository<T, ID> {
  findById: (id: ID) => Promise<T>;

  persist: (entity: T) => T;

  deleteById: (id: ID) => void;

  flush: () => Promise<void>;
}
