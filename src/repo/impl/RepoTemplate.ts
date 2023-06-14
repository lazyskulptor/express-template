import Repository from "@/service/Repository";
import { EntityClass, EntityManager, Primary, wrap } from "@mikro-orm/core";

export default class RepoTemplate<T extends Object, ID> implements Repository<T, ID> {

  private pkName: string;

  constructor(private em: EntityManager, private entityName: EntityClass<T>) {
    this.pkName = this.em.getMetadata().get(entityName.name).primaryKeys[0];
  }

  persist (entity: T) {
    const cloned = Object.assign(Object.create(Object.getPrototypeOf(entity)), entity) as T;

    if (!cloned[this.pkName]) {
      this.em.persist(cloned);
      return cloned;
    }
    const ref = this.em.getReference<T>(this.entityName, cloned[this.pkName]);

    wrap(ref).assign(cloned);
    return ref;
  }

  deleteById(id: ID) {
    const e = this.em.getReference<T>(this.entityName, id as Primary<T>);
    this.em.remove(e);
  }

  async findById(id: ID) {
    const where = {};
    where[this.pkName] = id;
    return await this.em.findOne<T, never>(this.entityName, where);
  }

  flush() {
    return this.em.flush();
  };
}
