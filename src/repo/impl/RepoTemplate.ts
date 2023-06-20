import Page from "@/domain/spec/Page";
import Spec from "@/domain/spec/Spec";
import Repository from "@/service/Repository";
import { EntityClass, EntityManager, Primary, RequiredEntityData, wrap } from "@mikro-orm/core";

export default class RepoTemplate<T extends object, ID> implements Repository<T, ID> {

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
    const data = wrap(entity).toPOJO();
    delete data[this.pkName];
    wrap(ref).assign(data);
    return ref;
  }

  deleteById(id: ID) {
    const e = this.em.getReference<T>(this.entityName, id as Primary<T>);
    this.em.remove(e);
  }

  async findOneBySpec(spec: Spec<T>) {
    return await this.em.findOne(this.entityName, spec.toWhere(), { populate: true });
  }

  async findPageBySpec(
    spec: Spec<T>,
    page = Page.req<T>({ offset: 0, limit: 20 })
  ) {
    const where = spec && spec.toWhere() ? spec.toWhere() : {};
    const result = await this.em.findAndCount(this.entityName, where, {
      offset: page.offset,
      limit: page.limit,
      populate: page.populate,
    });

    return page.clone({
      list: result[0],
      totalCnt: result[1],
    });
  }

  flush() {
    return this.em.flush();
  }

  private cloneObj(obj: T, hasPK = true) {
    const type = obj.constructor.name;
    const data = wrap(obj).toPOJO() as RequiredEntityData<T>;
    if (!hasPK) {
      delete data[this.pkName];
    }
    return this.em.create(type, data);
  }

  private copyObj(obj: T, hasPK = true) {
    const type = obj.constructor.name;
    const data = wrap(obj).toPOJO() as RequiredEntityData<T>;
    // if (!hasPK) {
    //   delete data[this.pkName];
    // }
    return this.em.create(type, data, { managed: true });
  }
}
