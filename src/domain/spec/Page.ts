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
    args: Pick<Partial<Page<Sub>>, 'offset' | 'limit'> | Populate<Sub, Hint>,
    _entityType?: EntityClass<Sub>,
  ) {
    return new Page<Sub>(args as Partial<Page<Sub>>);
  }

  clone<Hint extends string = never>(args: Partial<Omit<Page<T>, 'populate'>> | Populate<T, Hint> = {}) {
    return new Page<T>({
      ... this,
      ...args,
    });
  }
}
