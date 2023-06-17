import { FilterQuery } from "@mikro-orm/core";
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
    return this.criteria;
  }
}
