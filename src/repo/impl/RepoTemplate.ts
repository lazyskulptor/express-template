import Repository from "@/service/Repository";
import { EntityClass, EntityManager, Primary, RequiredEntityData, wrap } from "@mikro-orm/core";

export default class RepoTemplate<T extends Object, ID> implements Repository<T, ID> {

  private pkName: string;

  constructor(private em: EntityManager, private entityName: EntityClass<T>) {
    this.pkName = this.em.getMetadata().get(entityName.name).primaryKeys[0];
  }

  persist (entity: T) {

    if (!entity[this.pkName]) {
      const cloned = this.cloneObj(entity);
      this.em.persist(cloned);
      return cloned;
    }

    const ref = this.em.getReference<T>(this.entityName, entity[this.pkName]);
    const cloned = this.cloneObj(entity, false);

    Object.keys(cloned)
      .filter(k => k !== this.pkName && cloned[k] !== ref[k] && cloned[k] !== undefined)
      .forEach(k => {
        ref[k] = cloned[k];
      });
    this.em.merge(ref);
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

  private cloneObj(obj: T, hasPK = true) {
    const type = obj.constructor.name;
    const data = wrap(obj).toPOJO() as RequiredEntityData<T>;
    if (!hasPK) {
      delete data[this.pkName];
    }
    return this.em.create(type, data, { managed: true });
  }
}
