import { FilterQuery } from "@mikro-orm/core";

export default abstract class Spec<T extends object> {

  abstract isSatisfiedBy(...substitutes: T[]): boolean;

  abstract toWhere(): FilterQuery<T> ;

  static And<S extends object>(...specs: Spec<S>[]): Spec<S> {
    return new AndSpec<S>(...specs);
  }

  static Or<S extends object>(...specs: Spec<S>[]): Spec<S> {
    return new OrSpec<S>(...specs);
  }

  static Not<S extends object>(spec: Spec<S>): Spec<S> {
    return new NotSpec<S>(spec);
  }

  and(...specs: Spec<T>[]): Spec<T> {
    return new AndSpec<T>(this, ...specs);
  }

  or(...specs: Spec<T>[]): Spec<T> {
    return new OrSpec<T>(this, ...specs);
  }

  not(): Spec<T> {
    return new NotSpec<T>(this);
  }
}

export class AndSpec<T extends object> extends Spec<T> {
  private specs: Spec<T>[];

  constructor(...specs: Spec<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(...substitutes: T[]): boolean {
    const falseCnt = this.specs.filter(spec => !spec.isSatisfiedBy(...substitutes)).length;

    return falseCnt === 0;
  }

  toWhere(): FilterQuery<T> {
    const ddd = this.specs.map(spec => spec.toWhere());
    return { $and: ddd } as FilterQuery<T>;
  }
}

export class OrSpec<T extends object> extends Spec<T> {
  private specs: Spec<T>[];

  constructor(...specs: Spec<T>[]) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(...substitutes: T[]): boolean {
    const trueCnt = this.specs.filter(spec => spec.isSatisfiedBy(...substitutes)).length;

    return trueCnt > 0;
  }

  toWhere(): FilterQuery<T> {
    return { $or: this.specs } as FilterQuery<T>;
  }
}

export class NotSpec<T extends object> extends Spec<T> {

  constructor(private spec: Spec<T>) {
    super();
  }

  isSatisfiedBy(...substitutes: T[]): boolean {
    return this.spec.isSatisfiedBy(...substitutes);
  }

  toWhere(): FilterQuery<T> {
    return { $not: this.spec } as FilterQuery<T>;
  }
}
