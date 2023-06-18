import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export default class Authority {

  constructor(args?: string | Partial<Authority>) {
    if (args) {
      if (typeof args === 'string') this.name = args;
      else if (typeof args === 'object') {
        this.id = args.id;
        this.name = args.name;
      }
    }
  }

  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  name: string;

  clone(args: Partial<Authority> = {}): Authority {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), { ...this, ...args });
  }
}
