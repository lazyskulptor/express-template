import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export default class Member {

  @PrimaryKey()
  @Property()
  id!: number;

  @Property()
  name!: string;
}
