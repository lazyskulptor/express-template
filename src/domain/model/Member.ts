import { Collection, Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import Authority from "@/domain/model/Authority";

@Entity()
export default class Member {

  @PrimaryKey()
  @Property()
  id: number;

  @Property()
  username: string;

  @Property()
  password: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @ManyToMany()
  authorities = new Collection<Authority>(this);

  @Property()
  comment?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  createdAt = new Date();

  // get authorities() {
  //   return this._authorities;
  // }
}
