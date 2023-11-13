import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({
  tableName: 'users'
})
export class User extends BaseEntity<User> {
  @Property()
  email: string;

  @Property({ hidden: true })
  passwordHash: string;

  @Property({ nullable: true })
  fullName: string;
}
