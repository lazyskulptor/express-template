import { FilterQuery, wrap } from "@mikro-orm/core";
import Spec from "./Spec";

export default class EqualSpec<T extends object> extends Spec<T> {
  constructor(private criteria: T) {
    super();
  }

  isSatisfiedBy(...substitutes: T[]): boolean {
    const notMatchCnt = substitutes.filter(sub => !this.isMatch(sub)).length;
    return notMatchCnt === 0;
  }

  private isMatch(sub: T) {
    const notMatchCnt =  Object.keys(this.criteria)
      .filter(k => this.criteria[k] === undefined)
      .filter(k => this.criteria[k] !== sub[k]).length;
    return notMatchCnt === 0;
  }

  toWhere(): FilterQuery<T> {
    const filter = wrap(this.criteria).toPOJO();
    return this.filterEmpty(filter);
  }

  private filterEmpty(obj: unknown) {
    const queue = [obj];
    const filter = (prop: unknown) => {
      Object.entries(prop)
        .forEach(([k, v]) => {
          const isArray = Array.isArray(v);
          if (typeof v !== 'boolean' && (!v || (isArray && v.length === 0))) {
            delete prop[k];
          } else if (isArray) {
            v.forEach(e => queue.push(e));
          } else if (typeof v === 'object') {
            queue.push(v);
          }
        });
    };
    while(queue.length > 0) {
      const ele = queue.pop();
      filter(ele);
    }
    return obj as FilterQuery<T>;
  }
}
