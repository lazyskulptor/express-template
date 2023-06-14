import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export default class Authority {

  constructor(name?: string) {
    this.name = name;
  }

  @PrimaryKey()
  @Property()
  id: number;

  @Property()
  name: string;
}
