import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export default class Authority {

  constructor(name?: string) {
    this.name = name;
  }

  @PrimaryKey()
  name: string;
}
