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

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;
}
