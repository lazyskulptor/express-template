import { AutoPath, EntityClass } from "@mikro-orm/core/typings";

type Populate<T extends object, P extends string = never> = {
  populate?: AutoPath<T, P>[] | boolean,
};

export default class Page<T extends object> {
  readonly list: T[];
  readonly offset: number;
  readonly limit: number;
  readonly totalCnt: number;
  readonly populate: AutoPath<T, string>[] | boolean;

  constructor(args: Partial<Page<T>>) {
    this.list = args.list;
    this.offset = args.offset;
    this.limit = args.limit;
    this.totalCnt = args.totalCnt;
    this.populate = args.populate;
  }

  static req<Sub extends object, Hint extends string = never>(
    _entityType: EntityClass<Sub>,
    args: Pick<Partial<Page<Sub>>, 'offset' | 'limit' | 'populate'> & Populate<Sub, Hint>
  ) {
    return new Page<Sub>(args);
  }

  clone<Hint extends string = never>(args: Partial<Page<T>> & Populate<T, Hint> = {}): Page<T> {
    return new Page({
      ... this,
      ...args,
    });
  }
}
